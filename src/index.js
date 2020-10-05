import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { SocketIOProvider } from "./hooks/socket/provider";

ReactDOM.render(
  <SocketIOProvider
    opts={{
      url: "http://127.0.0.1:4001",
      reconnection: false,
    }}
  >
    <App />
  </SocketIOProvider>,
  document.getElementById("root")
);
