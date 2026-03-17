"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "wh40k_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7日間

export type LoginState = { error: string } | null;

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password") as string;
  const from = (formData.get("from") as string) || "/wh40k/full/builder";

  const correctPassword = process.env.WH40K_PASSWORD;
  if (!correctPassword || password !== correctPassword) {
    return { error: "パスワードが違います" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  redirect(from);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/wh40k");
}
