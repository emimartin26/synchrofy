import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";

import { useSocket } from "./hooks/socket/useSocket";
import Home from "./components/Home";
import Login from "./components/Login";

import "antd/dist/antd.css";

const gridStyle = {
  textAlign: "center",
};

function App() {
  const { socket } = useSocket();
  const [userLoggedIn, setUserLoggedIn] = useState("");

  useEffect(() => {
    socket.emit("logged in", function ({ username }) {
      username && setUserLoggedIn(username);
    });
  }, []);

  const handleOnClickLogout = () => {
    socket.emit("logout", function (ack) {
      setUserLoggedIn("");
    });
  };

  const handleOnKeyPress = (event) => {
    if (event.key === "Enter") {
      let name = event.target.value;
      socket.emit("register", name, function ({ username }) {
        setUserLoggedIn(username);
      });
    }
  };
  return (
    <div>
      <Card title="Synchrofy">
        {userLoggedIn ? (
          <Home
            userLoggedIn={userLoggedIn}
            handleOnClickLogout={handleOnClickLogout}
          />
        ) : (
          <Login handleOnKeyPress={handleOnKeyPress} />
        )}
      </Card>
    </div>
  );
}

export default App;
