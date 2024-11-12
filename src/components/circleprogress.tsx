import { useState, useEffect } from "react";
import classNames from "classnames";

export type Segment = {
  start: number;
  end: number;
};

type StatusBarProps = {
  name: string;
  startDay: number;
  startHour: number;
  endDay: number;
  endHour: number;
};

const weekendString = "Weekend";
const weekString = "Week";

const outerRadius = 70; // Outer circle radius
const innerRadius = 55; // Inner circle radius for the secondary data
const strokeWidth = 8;

const outerCircumference = 2 * Math.PI * outerRadius;
const innerCircumference = 2 * Math.PI * innerRadius;

const CircleProgress: React.FC<StatusBarProps> = (props) => {
  const { startDay, startHour, endDay, endHour, name } = props;
  const [outerCompletion, setOuterCompletion] = useState<number>(0);
  const [innerCompletion, setInnerCompletion] = useState<number>(0);
  const [isWeekend, setIsWeekend] = useState<boolean>(false);

  const outerProgressOffset =
    outerCircumference - (outerCompletion / 100) * outerCircumference;
  const innerProgressOffset =
    innerCircumference - (innerCompletion / 100) * innerCircumference;

  // Calculate the position of the outer indicator based on outer completion
  const outerAngle = (outerCompletion / 100) * 360;
  const outerRadians = outerAngle * (Math.PI / 180);
  const outerIndicatorX =
    outerRadius + strokeWidth + outerRadius * Math.cos(outerRadians);
  const outerIndicatorY =
    outerRadius + strokeWidth + outerRadius * Math.sin(outerRadians);

  // Calculate the position of the inner indicator based on inner completion
  const innerAngle = (innerCompletion / 100) * 360;
  const innerRadians = innerAngle * (Math.PI / 180);
  const innerIndicatorX =
    outerRadius + strokeWidth + innerRadius * Math.cos(innerRadians);
  const innerIndicatorY =
    outerRadius + strokeWidth + innerRadius * Math.sin(innerRadians);

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
    if (weekCompletion === 100) {
      setInnerCompletion(100);
      setIsWeekend(true);
      const weekendCompletion = calculateWeekCompletion({
        startDay: endDay,
        startHour: endHour,
        endDay: startDay,
        endHour: startHour,
        name: name,
      });
      setOuterCompletion(weekendCompletion);
    } else {
      setInnerCompletion(calculateInnerCompletion(props));
      setIsWeekend(false);
      setOuterCompletion(weekCompletion);
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
    <div className="flex flex-col items-center px-10">
      <p className="text-gray-700 font-medium mb-2">{`${name}'s ${
        isWeekend ? weekendString : weekString
      }`}</p>
      <svg
        width={2 * (outerRadius + strokeWidth)}
        height={2 * (outerRadius + strokeWidth)}
        className="relative"
      >
        {/* Outer Background Circle */}
        <circle
          cx={outerRadius + strokeWidth}
          cy={outerRadius + strokeWidth}
          r={outerRadius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />

        {/* Outer Progress Circle */}
        <circle
          cx={outerRadius + strokeWidth}
          cy={outerRadius + strokeWidth}
          r={outerRadius}
          fill="none"
          stroke={isWeekend ? "#10B981" : "#1D4ED8"}
          strokeWidth={strokeWidth}
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerProgressOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Outer Segment Overlays */}
        {!isWeekend &&
          segments?.map((segment, index) => {
            const segmentStart = (segment.start / 100) * outerCircumference;
            const segmentLength =
              ((segment.end - segment.start) / 100) * outerCircumference;
            return (
              <circle
                key={index}
                cx={outerRadius + strokeWidth}
                cy={outerRadius + strokeWidth}
                r={outerRadius}
                fill="none"
                stroke="#000000"
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${
                  outerCircumference - segmentLength
                }`}
                strokeDashoffset={outerCircumference - segmentStart}
                opacity={0.15}
                className="transition-opacity duration-1000 ease-out"
              />
            );
          })}

        {/* Outer Subtle Indicator Dot */}
        <circle
          cx={outerIndicatorX}
          cy={outerIndicatorY}
          r="2.5" // Smaller size for the dot
          fill="#000000"
          opacity="0.5" // Lower opacity for a more discrete look
        />

        {!isWeekend && (
          <>
            {/* Inner Background Circle */}
            <circle
              cx={outerRadius + strokeWidth}
              cy={outerRadius + strokeWidth}
              r={innerRadius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
            />
            {/* Inner Progress Circle */}
            <circle
              cx={outerRadius + strokeWidth}
              cy={outerRadius + strokeWidth}
              r={innerRadius}
              fill="none"
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={innerCircumference}
              strokeDashoffset={innerProgressOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Inner Subtle Indicator Dot */}
            {innerCompletion < 100 && (
              <circle
                cx={innerIndicatorX}
                cy={innerIndicatorY}
                r="2.5" // Smaller size for the inner dot
                fill="#000000"
                opacity="0.5" // Lower opacity for a more discrete look
              />
            )}
          </>
        )}

        {/* Centered Percentage Text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className={classNames("text-xl font-semibold fill-gray-700", {
            "fill-green-700": isWeekend,
          })}
        >
          {outerCompletion.toFixed(2)}%
        </text>

        {!isWeekend && (
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            dy=".3em"
            className={classNames(
              "text-xs font-semibold fill-gray-700 opacity-60",
              {
                "fill-green-700": innerCompletion >= 100,
              }
            )}
          >
            {innerCompletion.toFixed(2)}%
          </text>
        )}
      </svg>
    </div>
  );
};

const calculateInnerCompletion = (props: StatusBarProps): number => {
  const { startDay, startHour, endDay, endHour } = props;

  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= startHour && currentHour <= endHour) {
    return ((currentHour - startHour) / (endHour - startHour)) * 100;
  }

  return 100;
};

const calculateWeekCompletion = (props: StatusBarProps): number => {
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
    return 0; // Work week hasn't started yet
  } else if (now > endOfWeek) {
    return 100; // Work week is already over
  }

  // Total duration of the work week in milliseconds
  const totalWorkWeekTime = endOfWeek.getTime() - startOfWeek.getTime();
  const timePassed = now.getTime() - startOfWeek.getTime();

  // Calculate the percentage completed
  const percentageCompleted = (timePassed / totalWorkWeekTime) * 100;
  return percentageCompleted;
};

export default CircleProgress;
