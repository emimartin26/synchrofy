import http from "http";

import buildApp from "./utils/express";
import buildSocket from "./utils/socket";
import sessionMiddleware from "./utils/sessionMiddleware";

const port = process.env.PORT || 4001;

const app = buildApp({
  sessionMiddleware,
});

const server = http.createServer(app);

const io = buildSocket({ sessionMiddleware, server });

let users_online = [];
let users_sync = [];
let turn = null;
let syncStarted = false;

io.on("connection", (socket) => {
  let addedUser = false;

  socket.on("start sync", () => {
    if (!syncStarted) {
      users_sync = [...users_online];
      syncStarted = true;

      turn = users_sync[Math.floor(Math.random() * users_sync.length)];

      users_sync = users_sync.filter((user) => user.id !== turn.id);
      
      io.emit("users sync changed", {
        users_sync,
        turn,
      });
    }
  });

  socket.on("sync users", () => {
    socket.emit("users sync changed", { users_sync, turn });
  });

  socket.on("next turn", () => {
    turn = users_sync[Math.floor(Math.random() * users_sync.length)];

    users_sync = users_sync.filter((user) => user.id !== turn.id);

    io.emit("users sync changed", {
      users_sync,
      turn: turn,
    });

    if (users_sync.length == 0) syncStarted = false;

  });

  socket.on("online users", (callback) => {
    callback({ users_online });
  });

  socket.on("register", (username, callback) => {
    const session = socket.request.session;

    if (session.username) return;

    // we store the username in the socket session for this client
    session.username = username;
    session.save();

    let newUser = { id: session.id, name: username };

    users_online.push(newUser);

    socket.broadcast.emit("streamUsers", { users_online });

    callback({ username });
  });

  socket.on("logged in", (callback) => {
    const session = socket.request.session;
    session.username && callback({ username: session.username });
  });

  socket.on("logout", (callback) => {
    const session = socket.request.session;
    users_online = users_online.filter((user) => user.id !== session.id);
    session.username = null;

    socket.broadcast.emit("streamUsers", {
      users_online,
    });

    callback("logout succes");
  });

  socket.on("disconnect", () => {
    if (addedUser) {
      users_online = users_online.filter((user) => user.id !== socket.id);
      io.emit("streamUsers", {
        users_online,
      });

      console.log("Client disconnected: " + socket.username);
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
