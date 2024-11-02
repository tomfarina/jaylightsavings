import Image from "next/image";
import StatusBar from "./components/statusbar";

type StatusBarProps = {
  name: string;
  startDay: number;
  startHour: number;
  endDay: number;
  endHour: number;
};

const statusBars: StatusBarProps[] = [
  { name: "Jay", startDay: 0, startHour: 4, endDay: 3, endHour: 15 },
  { name: "Normal Person", startDay: 1, startHour: 9, endDay: 5, endHour: 17 },
];
const jaysDaysOfWeek = [
  "Monday",
  "Tuesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Saturday 2",
  "Sunday",
];

export default function Home() {
  return (
    <div className="grid  items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-2xl">
        bahaha it's jay's {jaysDaysOfWeek[new Date().getDay()]}
      </div>

      {statusBars.map((bar, index) => (
        <StatusBar {...bar} key={index} />
      ))}
    </div>
  );
}
