import z from "zod";
import type { RequestHandler } from "express";

export const validateBody =
  <T extends z.ZodType>(schema: T): RequestHandler<any, {}, z.infer<T>> =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid body",
        details: z.treeifyError(result.error),
      });
    }

    req.body = result.data;
    next();
  };

export const validateParams =
  <T extends z.ZodType>(schema: T): RequestHandler<z.infer<T>> =>
  (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid params",
        details: z.treeifyError(result.error),
      });
    }

    req.params = result.data;
    next();
  };
