import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { apiErrorHandler } from "@/lib/utils";
import { getUserRole } from "@/utils/utils";

export const dynamic = 'force-dynamic';

export const POST = apiErrorHandler(async (req: NextRequest) => {
  try {
    const userInput = await req.json();

    const { password, email } = userInput;
  
    const supabase = createClient();
  
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  
    const role = getUserRole(user as User);
  
    return NextResponse.redirect(new URL(`/${role}`, req.url), 303);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Something went wrong" }, { status: 400 });
  }
});
