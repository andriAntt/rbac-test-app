import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/types/user";

export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function getUserRole(user: User): UserRole | null {
  if (!user) return null;

  const metadata = user.app_metadata;

  const role = metadata.user_role;

  return role;
}
