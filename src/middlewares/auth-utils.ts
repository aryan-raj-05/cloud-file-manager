import type { RequestHandler } from "express";
import { auth } from "../lib/auth.js";

export const authUser: RequestHandler = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.sendStatus(401);
  }

  req.user = session.user;
  next();
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }

  next();
};
