import express from "express";
import session from "express-session";
import http from "http";
import cookie from "cookie";
import socketIo from "socket.io";

const port = process.env.PORT || 4001;
const index = require("./routes/index.js");

const app = express();

const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 3600000 * 5, // 5 hours
  },
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.static("./build"));

app.use(index);

const server = http.createServer(app);

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

let users = [];

io.on("connection", (socket) => {
  let addedUser = false;

  socket.on("question", (name, callback) => {
    if (name === "is logged in?") {
      const session = socket.request.session;
      session.username && callback({ username: session.username, data: users });
    }
  });

  socket.on("register", (username, callback) => {
    const session = socket.request.session;

    if (session.username) return;

    // we store the username in the socket session for this client
    session.username = username;
    session.save();

    console.log("register: " + username);

    let newUser = { id: session.id, name: username };

    users.push(newUser);

    socket.broadcast.emit("streamUsers", { data: users });

    callback({ username, data: users });
  });

  socket.on("logout", (callback) => {
    const session = socket.request.session;
    users = users.filter((user) => user.id !== session.id);
    session.username = null;

    socket.broadcast.emit("streamUsers", {
      data: users,
    });

    callback("logout succes")
  });

  socket.on("disconnect", () => {
    if (addedUser) {
      users = users.filter((user) => user.id !== socket.id);
      io.emit("streamUsers", {
        data: users,
      });

      console.log("Client disconnected: " + socket.username);
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
