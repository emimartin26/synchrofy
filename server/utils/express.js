import express from "express";
import routes from "../routes/";


export default function buildApp({ sessionMiddleware }) {
  const app = express();

  app.use(sessionMiddleware);
  app.use(express.json());
  app.use(express.static("./build"));

  app.use(routes);

  return app;
};