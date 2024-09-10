import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (isServer = false) => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    isServer ? process.env.SUPABASE_SERVICE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.log('Middleware error', error);
          }
        },
      },
    },
  );
};
