import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { handleAccessControl } from "@/lib/utils";
import Sidebar from "@/components/sidebar";


export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headerList = headers();
  const pathname = headerList.get("x-current-path");

  if (!user || !pathname) {
    return redirect("/sign-in");
  }

  handleAccessControl(user, pathname);

  return (
    <div className="flex-1 w-full flex flex-col items-center h-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-end items-center p-3 px-5 text-sm">
          {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
        </div>
      </nav>
      <div className="flex flex-row grow w-full">
        <Sidebar />

        <div className="flex flex-col gap-20 max-w-5xl p-5 w-[70%] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
