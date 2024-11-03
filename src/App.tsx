import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./styles/globals.css";

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

function App() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            bahaha it's jay's {jaysDaysOfWeek[new Date().getDay()]}
          </h1>

          <div className="flex space-x-4">
            {statusBars.map((bar, index) => (
              <StatusBar {...bar} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
