import express from "express";
import morgan from "morgan";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

export const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
