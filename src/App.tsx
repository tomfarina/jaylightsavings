import "./App.css";
import "./styles/globals.css";

import StatusBar from "./components/statusbar";
import CircleProgress from "./components/circleprogress";

type StatusBarProps = {
  name: string;
  startDay: number;
  startHour: number;
  endDay: number;
  endHour: number;
};

const statusBars: StatusBarProps[] = [
  { name: "jay", startDay: 0, startHour: 4, endDay: 3, endHour: 15 },
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
      <div className="min-h-screen bg-[#080d1b] flex items-center justify-center">
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            bahaha it's jay's {jaysDaysOfWeek[new Date().getDay()]}
          </h1>

          <img
            src="/jaylightsavings/ok.png"
            alt="Floating Image"
            className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-cover rounded-full shadow-lg opacity-80 max-lg:hidden"
            style={{ animation: "float 5s ease-in-out infinite" }}
          />

          <div className="flex justify-center gap-10 max-sm:flex-col">
            {statusBars.map((bar, index) => (
              <CircleProgress {...bar} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
