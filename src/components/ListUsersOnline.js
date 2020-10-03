import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/socket/useSocket";
import ListUsers from "./ListUsers";

function ListUsersOnline() {

  const [users, setUsers] = useState([]);
  const { socket } = useSocket("streamUsers", ({ users_online }) =>
    setUsers(users_online)
  );

  useEffect(() => {
    socket.emit("online users", function ({ users_online }) {
      setUsers(users_online);
    });
  }, []);

  return <ListUsers users={users} title="Users Online" />;
}

export default ListUsersOnline;
