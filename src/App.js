import React, { useContext } from "react";
import "./App.css";
import Chart from "./Chart";
import { ChartContext } from "./ChartContext";

function App() {
  const { arrayLength, setArrayLength, setSpeed } = useContext(ChartContext);

  const handleChange = (value) => {
    setArrayLength(value > 150 ? 150 : value < 2 ? 2 : value);
  };

  return (
    <>
      <div className="controls">
        <div className="amount-container">
          <h2>Select Value between 2 - 150</h2>
          <button
            onClick={() =>
              setArrayLength((prev) => (prev - 1 < 2 ? prev : prev - 1))
            }
          >
            -
          </button>
          <input
            type="number"
            value={arrayLength}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
          <button
            onClick={() =>
              setArrayLength((prev) => (prev + 1 >= 150 ? prev : prev + 1))
            }
          >
            +
          </button>
        </div>

        <div className="speed-container">
          <h2>Select Sorting Speed</h2>
          <button
            onClick={() => {
              setSpeed(160);
            }}
          >
            Very Slow
          </button>
          <button
            onClick={() => {
              setSpeed(80);
            }}
          >
            Slow
          </button>
          <button
            onClick={() => {
              setSpeed(40);
            }}
          >
            Medium
          </button>
          <button
            onClick={() => {
              setSpeed(20);
            }}
          >
            Fast
          </button>
          <button
            onClick={() => {
              setSpeed(10);
            }}
          >
            Very Fast
          </button>
        </div>
      </div>
      <Chart />
    </>
  );
}

export default App;
