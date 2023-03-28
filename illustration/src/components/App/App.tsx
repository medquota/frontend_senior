import "./App.css";
import inputData from "../../input.json";
import Calendar from "../Calendar/Calendar.tsx";

interface Event {
  id: number;
  start: string;
  duration: number;
}

const App: FC = () => {
  return (
    <div className="App">
      <Calendar data={inputData as Event[]} />
    </div>
  );
};

export default App;
