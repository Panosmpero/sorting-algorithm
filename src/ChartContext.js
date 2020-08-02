import React, { createContext, useState } from "react";
import * as d3 from "d3";

export const ChartContext = createContext();

const ChartContextProvider = ({ children }) => {
  const [arrayLength, setArrayLength] = useState(5);
  const [speed, setSpeed] = useState(50);

  let data = d3.shuffle(d3.range(1, arrayLength + 1)),
    unsortedData = data.slice(),
    sortedData = [];








  return <ChartContext.Provider value={{
    arrayLength, setArrayLength, data, unsortedData, sortedData, speed, setSpeed
  }}>{children}</ChartContext.Provider>;
};

export default ChartContextProvider;
