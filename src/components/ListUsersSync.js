import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/socket/useSocket";
import ListUsers from "./ListUsers";

function ListUsersSync({ userLoggedIn }) {
  const [data, setData] = useState({ users_sync: [] });

  const { socket } = useSocket("users sync changed", ({ users_sync, turn }) => {
    setData({ users_sync, turn });
  });

  useEffect(() => {
    socket.emit("sync users");
  }, []);

  const handleOnClikNext = () => {
    socket.emit("next turn");
  };

  const handleOnClikStart = () => {
    socket.emit("start sync");
  };

  return (
    <>
      <ListUsers users={data.users_sync} title="Users Sync" />
      <button onClick={handleOnClikStart}>Start</button>

      {data.turn && (
        <div>
          <h2>Turn: {data.turn.name}</h2>
          <button
            disabled={!(userLoggedIn === data.turn.name)}
            onClick={handleOnClikNext}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
export default ListUsersSync;
