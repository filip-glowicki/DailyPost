import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { Database } from "./database.types";

const PROTECTED_ROUTES = [
  "/post/editor",
  "/posts/history",
  "/categories",
  "forgot-password",
] as const;
const AUTH_ROUTES = ["/sign-in", "/sign-up"] as const;
const DEFAULT_AUTHENTICATED_REDIRECT = "/post/editor";
const DEFAULT_UNAUTHENTICATED_REDIRECT = "/sign-in";

type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
type AuthRoute = (typeof AUTH_ROUTES)[number];

const isProtectedRoute = (pathname: string): pathname is ProtectedRoute => {
  return PROTECTED_ROUTES.includes(pathname as ProtectedRoute);
};

const isAuthRoute = (pathname: string): pathname is AuthRoute => {
  return AUTH_ROUTES.includes(pathname as AuthRoute);
};

const handleRouteAccess = (
  pathname: string,
  isAuthenticated: boolean,
  requestUrl: string,
): NextResponse | null => {
  // Handle root path redirect for authenticated users
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTHENTICATED_REDIRECT, requestUrl),
    );
  }

  // Handle protected routes
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, requestUrl),
    );
  }

  // Handle auth routes for authenticated users
  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTHENTICATED_REDIRECT, requestUrl),
    );
  }

  return null;
};

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
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

    const { error } = await supabase.auth.getUser();
    const isAuthenticated = !error;

    const routeResponse = handleRouteAccess(
      request.nextUrl.pathname,
      isAuthenticated,
      request.url,
    );

    if (routeResponse) {
      return routeResponse;
    }

    return response;
  } catch {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
