import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ChartContextProvider from "./ChartContext";

ReactDOM.render(
  <ChartContextProvider>
    <App />
  </ChartContextProvider>,
  document.getElementById("root")
);
