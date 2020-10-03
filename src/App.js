import React, { useState, useEffect } from "react";
import { useSocket } from "./hooks/socket/useSocket";
import ListUsersOnline from "./components/ListUsersOnline";
import ListUsersSync from "./components/ListUsersSync";

function App() {
  const { socket } = useSocket();
  const [userLoggedIn, setUserLoggedIn] = useState("");

  useEffect(() => {
    socket.emit("logged in", function ({ username }) {
      username && setUserLoggedIn(username);
    });
  }, []);

  const handleOnClikLogout = () => {
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
    <>
      {userLoggedIn && (
        <>
          <h1>Welcomeee {userLoggedIn}!</h1>
          <ListUsersOnline />
          <ListUsersSync userLoggedIn={userLoggedIn} />
          <button onClick={handleOnClikLogout}>Exit</button>
        </>
      )}
      {!userLoggedIn && <input type="text" onKeyPress={handleOnKeyPress} />}
    </>
  );
}

export default App;
