import "express";
import type { auth } from "../lib/auth.ts";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;
type AuthUser = NonNullable<Session>["user"];

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
