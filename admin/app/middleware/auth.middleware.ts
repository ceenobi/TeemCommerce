import { redirect } from "react-router";
import type { AppLoadContext } from "react-router";
import type { UserData } from "~/lib/schemaValidations";
import { getUserSession } from "~/routes/api/auth-route";

export interface RouterContext extends AppLoadContext {
  user?: UserData;
  cookie?: string;
}

/**
 * Middleware for guest-only routes (e.g., Login, Signup).
 * Redirects authenticated users to the dashboard.
 */
export async function guestOnlyMiddleware(
  { request }: { request: Request },
  next: () => Promise<Response>,
) {
  const cookie = request.headers.get("Cookie") || "";
  const session = await getUserSession({ cookie });

  if (session.status === 200) {
    return redirect("/");
  }

  return await next();
}

/**
 * Middleware for authenticated routes (e.g., Dashboard).
 * Redirects guests to the login page and provides user context to loaders.
 */
export async function authenticatedMiddleware(
  { request, context }: { request: Request; context: RouterContext },
  next: () => Promise<Response>,
) {
  const cookie = request.headers.get("Cookie") || "";
  const session = await getUserSession({ cookie });

  if (session.status !== 200) {
    return redirect("/account/signin");
  }

  // Pass user and cookie to context so loaders don't have to re-fetch
  context.user = session.body;
  context.cookie = cookie;

  return await next();
}

/**
 * Middleware for routes that need session data if available but are publicly accessible.
 * Provides user context to loaders if authenticated, otherwise continues without redirecting.
 */
export async function sessionMiddleware(
  { request, context }: { request: Request; context: RouterContext },
  next: () => Promise<Response>,
) {
  const cookie = request.headers.get("Cookie") || "";
  const session = await getUserSession({ cookie });

  if (session.status === 200) {
    context.user = session.body;
    context.cookie = cookie;
  }

  return await next();
}
