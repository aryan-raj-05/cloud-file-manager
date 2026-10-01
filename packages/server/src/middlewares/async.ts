import type { RequestHandler } from "express";

export const asyncHandler =
  (fn: RequestHandler<any>): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
