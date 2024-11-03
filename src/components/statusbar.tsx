"use client";

import { useState, useEffect } from "react";

type StatusBarProps = {
  startDay: number;
  startHour: number;
  endDay: number;
  endHour: number;
  name: string;
};

const StatusBar: React.FC<StatusBarProps> = (props) => {
  const { startDay, startHour, endDay, endHour, name } = props;
  const [completion, setCompletion] = useState<string>("0");
  const [week, setWeek] = useState<string>("Week");

  const calculateCompletion = (): any => {
    const weekCompletion = calculateWeekCompletion(props);
    if (weekCompletion === "100") {
      setWeek("Weekend");
      const weekendCompletion = calculateWeekCompletion({
        startDay: endDay,
        startHour: endHour,
        endDay: startDay,
        endHour: startHour,
        name: name,
      });
      setCompletion(weekendCompletion);
    } else {
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
    <div className="m-auto">
      <div className="p-4">
        <p className="text-lg font-semibold mb-2">{`${name}'s ${week} is ${completion}% over.`}</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-500 h-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${completion}%` }}
          >
            {completion}%
          </div>
        </div>
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
