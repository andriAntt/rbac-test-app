import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/utils/utils";
import { User } from "@supabase/supabase-js";
import SignInForm from "@/components/sign-in-form";

export default async function Login() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = getUserRole(user as User);

    return redirect(`/${role}`);
  }


  return (
    <SignInForm />
  );
}
