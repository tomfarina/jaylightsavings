import { useState, useEffect } from "react";
import classNames from "classnames";

type StatusBarProps = {
  startDay: number;
  startHour: number;
  endDay: number;
  endHour: number;
  name: string;
};

export type Segment = {
  start: number;
  end: number;
};

const weekendString = "Weekend";
const weekString = "Week";
const StatusBar: React.FC<StatusBarProps> = (props) => {
  const { startDay, startHour, endDay, endHour, name } = props;
  const [completion, setCompletion] = useState<string>("0");
  const [isWeekend, setIsWeekend] = useState<boolean>(false);

  const totalWorkweekHours =
    24 - startHour + endHour + (endDay - startDay - 1) * 24;
  const dailyHours = endHour - startHour;
  const workDays = endDay - startDay + 1;

  const segments = Array.from({ length: workDays }, (_, i) => ({
    start: ((i * 24) / totalWorkweekHours) * 100,
    end: ((i * 24 + dailyHours) / totalWorkweekHours) * 100,
  }));

  const calculateCompletion = (): any => {
    const weekCompletion = calculateWeekCompletion(props);
    if (weekCompletion === "100") {
      setIsWeekend(true);
      const weekendCompletion = calculateWeekCompletion({
        startDay: endDay,
        startHour: endHour,
        endDay: startDay,
        endHour: startHour,
        name: name,
      });
      setCompletion(weekendCompletion);
    } else {
      setIsWeekend(false);
      setCompletion(weekCompletion);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateCompletion();
    }, 10000); // Update every second

    // Initial calculation
    calculateCompletion();

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [startDay, startHour, endDay, endHour, calculateCompletion]);

  return (
    <div className="flex-1">
      <p className="text-gray-700 font-medium mb-1">{`${name}'s ${
        isWeekend ? weekendString : weekString
      } is ${completion}% over.`}</p>
      <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          className={classNames(
            "bg-blue-500  h-full text-xs font-semibold text-white text-center p-1 leading-none",
            { "bg-green-500": isWeekend }
          )}
          style={{ width: `${completion}%` }}
        >
          {completion}%
        </div>

        {!isWeekend &&
          segments?.map((segment, index) => (
            <div
              key={index}
              className="absolute bottom-0 h-[20%] bg-red-500 opacity-75"
              style={{
                left: `${segment.start}%`,
                width: `${segment.end - segment.start}%`,
              }}
            />
          ))}
      </div>
    </div>
  );
};

const calculateWeekCompletion = (props: StatusBarProps): string => {
  const { startDay, startHour, endDay, endHour } = props;
  const now = new Date();
  const currentDayOfWeek = now.getDay();

  // Calculate the start of the work week
  const startOfWeek = new Date(now);
  const diffToStart = (currentDayOfWeek - startDay + 7) % 7;
  startOfWeek.setDate(now.getDate() - diffToStart);
  startOfWeek.setHours(startHour, 0, 0, 0);

  // Calculate the end of the work week
  const endOfWeek = new Date(startOfWeek);
  const diffToEnd = (endDay - startDay + 7) % 7;
  endOfWeek.setDate(startOfWeek.getDate() + diffToEnd);
  endOfWeek.setHours(endHour, 0, 0, 0);

  // Check if the current time is within the range
  if (now < startOfWeek) {
    return "0"; // Work week hasn't started yet
  } else if (now > endOfWeek) {
    return "100"; // Work week is already over
  }

  // Total duration of the work week in milliseconds
  const totalWorkWeekTime = endOfWeek.getTime() - startOfWeek.getTime();
  const timePassed = now.getTime() - startOfWeek.getTime();

  // Calculate the percentage completed
  const percentageCompleted = (timePassed / totalWorkWeekTime) * 100;
  return percentageCompleted.toFixed(2);
};

export default StatusBar;
