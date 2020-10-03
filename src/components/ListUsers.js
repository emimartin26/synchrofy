import React from "react";

function ListUsers({ users, title }) {
  return (
     <>
      <h2>{title}</h2>
      <ul>
        {users.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </>
  );
}

export default ListUsers;
