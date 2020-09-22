import React, { useState } from "react";
import { useSocket } from "../hooks/socket/useSocket";

function ListUsers({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);

  useSocket("streamUsers", ({ data }) => setUsers(data));

  return (
    <ul>
      {users.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  );
}

export default ListUsers;
