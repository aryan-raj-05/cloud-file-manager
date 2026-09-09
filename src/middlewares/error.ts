import { logger } from "../lib/logger.js";
import type { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(
    status = 500,
    message = "Internal Server Error",
    code = "INTERNAL_ERROR",
    options?: ErrorOptions,
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.status = status;
    this.code = code;
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
    };
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Invalid credentials") {
    super(401, message, "AUTH_INVALID");
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request") {
    super(400, message, "BAD_REQUEST");
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(404, message, "NOT_FOUND");
  }
}

function normalizeError(err: unknown) {
  if (err instanceof HttpError) return err;

  return new HttpError(500, "Internal Server Error", "INTERNAL_ERROR", {
    cause: err instanceof Error ? err : undefined,
  });
}

// Middleware
export const errorHandler = (err: unknown, req: Request, res: Response) => {
  if (!(err instanceof HttpError)) {
    logger.error({
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });
  }

  const e = normalizeError(err);
  return res.status(e.status).json(e.toJSON());
};
