import session from "express-session";

export default session({
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 3600000 * 5, // 5 hours
  },
});
