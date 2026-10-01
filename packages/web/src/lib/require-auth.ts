// lib/require-auth.ts
import { redirect } from "react-router";
import { authClient } from "./auth-client";

export async function requireAuth() {
  const { data } = await authClient.getSession();

  if (!data?.user) {
    throw redirect("/login");
  }

  return data;
}
