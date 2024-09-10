import { NextRequest, NextResponse } from 'next/server';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "@supabase/supabase-js";
import { getUserRole } from "@/utils/utils";
import { redirect } from "next/navigation";
import { ApiError } from './exceptions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleAccessControl = (user: User, pathname: string) => {
  const role = getUserRole(user as User);

  if (!role) {
    return redirect("/sign-in");
  }

  if (!pathname.startsWith(`/${role}`)) {
    return redirect(`${role}`);
  }
}


export function apiErrorHandler(fn: any) {
  return async function (request: NextRequest, ...args: unknown[]) {
    try {
      return await fn(request, ...args);
    } catch (error) {
      switch (true) {
        case error instanceof ApiError:
          const apiError = error as ApiError;
          if (apiError.redirectTo) {
            return NextResponse.redirect(
              `${
                apiError.redirectTo
              }?errorMsg=${encodeURIComponent(apiError.message)}&errorCode=${
                apiError.status
              }`,
            );
          } else {
            return NextResponse.json(
              {
                error: {
                  type: apiError.type,
                  message: apiError.message,
                  data: apiError.data,
                },
              },
              { status: apiError.status },
            );
          }
        case error instanceof Error:
          return NextResponse.json(
            { error: { message: 'Internal server error.', data: null } },
            { status: 500 },
          );
        default:
          return NextResponse.json(
            { error: { message: 'Internal server error.', data: null } },
            { status: 500 },
          );
      }
    }
  };
};
