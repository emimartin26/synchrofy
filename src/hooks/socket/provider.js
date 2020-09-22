import React, { useRef } from "react";
import io from "socket.io-client";
import { SocketIOContext } from "./context";


export const SocketIOProvider = ({
  opts,
  children,
}) => {

  const socketRef = useRef();

  if (!socketRef.current) {
      socketRef.current = io(opts);
  }

  return (
    <SocketIOContext.Provider value={socketRef.current}>
      {children}
    </SocketIOContext.Provider>
  );
};