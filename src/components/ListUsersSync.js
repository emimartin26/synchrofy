import React, { useState, useEffect } from "react";
import { Button } from "antd";

import { useSocket } from "../hooks/socket/useSocket";
import ListUsers from "./ListUsers";
import { StepForwardOutlined, CaretRightOutlined } from "@ant-design/icons";

function ListUsersSync({ userLoggedIn }) {
  const [data, setData] = useState({ users_sync: [] });

  const { socket } = useSocket("users sync changed", ({ users_sync, turn }) => {
    setData({ users_sync, turn });
  });

  useEffect(() => {
    socket.emit("sync users");
  }, []);

  const handleOnClickNext = () => {
    socket.emit("next turn");
  };

  return (
    <>
      <ListUsers
        users={data.users_sync}
        title="Users Sync"
        subtitle={data.turn && `Turn: ${data.turn.name}`}
      />
      <Button
        style={{ marginTop: "8px" }}
        icon={<StepForwardOutlined />}
        disabled={data.turn && !(userLoggedIn === data.turn.name)}
        onClick={handleOnClickNext}
        type="primary"
      >
        Next
      </Button>
    </>
  );
}
export default ListUsersSync;
