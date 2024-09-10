import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getUserRole } from "@/utils/utils";

export const updateSession = async (request: NextRequest) => {
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  try {
    let response = NextResponse.next({
      request: {
        headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (
      !request.nextUrl.pathname.startsWith("/sign-in") && !request.nextUrl.pathname.startsWith("/api") && (!user || error)
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/api")) {
      const role = getUserRole(user!);

      if (request.nextUrl.pathname.startsWith('/api/auth')) {
        return response;
      }

      if (!request.nextUrl.pathname.startsWith(`/api/${role}`)) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }
};
