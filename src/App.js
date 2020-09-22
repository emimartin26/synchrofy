import React, { useState, useEffect } from "react";
import { useSocket } from "./hooks/socket/useSocket";
import ListUsers from "./components/ListUsers";

function App() {
  const { socket } = useSocket();
  const [initialData, setInitialData] = useState({});
  const { userLoggedIn, initialUsers } = initialData;

  const handleOnClik = () => {
    socket.emit("logout", function (ack) {
      setInitialData({});
    });
  };

    const handleOnKeyPress = (event) => {
      if (event.key === "Enter") {
        let name = event.target.value;
        socket.emit("register", name, function ({ username, data }) {
          setInitialData({
            userLoggedIn: username,
            initialUsers: data,
          });
        });
      }
    };

  useEffect(() => {
    socket.emit("question", "is logged in?", function ({ username, data }) {
      username &&
        setInitialData({
          userLoggedIn: username,
          initialUsers: data,
        });
    });
  }, [])


  return (
    <>
      {userLoggedIn && (
        <>
          <h1>Welcomeee {userLoggedIn}!</h1>{" "}
          <ListUsers initialUsers={initialUsers} />
          <button onClick={handleOnClik} >Exit</button>
        </>
      )}
      {!userLoggedIn && <input type="text" onKeyPress={handleOnKeyPress} />}
    </>
  );
}

export default App;
