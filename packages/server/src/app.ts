import cors from "cors";
import morgan from "morgan";
import express, { type Express } from "express";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";
import { errorHandler } from "./middlewares/error.js";
import { fileSystemRouter } from "./features/files/files.route.js";

export const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(morgan("combined"));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/api/files", fileSystemRouter);

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);
