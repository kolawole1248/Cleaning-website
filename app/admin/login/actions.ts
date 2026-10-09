"use server";

import { redirect } from "next/navigation";
import {
  clearAttempts,
  createSession,
  tooManyAttempts,
  verifyLogin,
} from "@/lib/auth";

export type LoginState = { error?: string } | null;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (tooManyAttempts(email)) {
    return {
      error: "Too many failed attempts. Please wait 10 minutes and try again.",
    };
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return { error: "Incorrect email or password." };
  }

  clearAttempts(email);
  await createSession(user.email);
  redirect("/admin");
}
