import socketIo from "socket.io";


export default function buildSocket({ sessionMiddleware, server }) {
  const io = socketIo(server, {
    pingTimeout: 60000, // https://socket.io/docs/server-api/,
    cookie: false,
    //cookieHttpOnly: true,
  });

  // register middleware in Socket.IO
  io.use((socket, next) => {
    console.log("cookie: " + socket.handshake.headers["cookie"]);
    //socket.request.cookie = socket.handshake.headers["cookie"];
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  return io;
}
