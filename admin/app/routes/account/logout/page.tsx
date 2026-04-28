import type { Route } from "./+types/page";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getQueryClientRsc } from "~/lib/getQueryClient";
import { logOutUserApi } from "~/routes/api/auth-route";

export const action = async ({ request }: Route.ActionArgs) => {
  const res = await logOutUserApi({
    cookie: request.headers.get("Cookie") || "",
  });
  // ts-rest client returns an object with status, body, and headers
  if (res.status !== 200) {
    return res;
  }

  const headers = new Headers();

  if (res.headers) {
    const rawHeaders = res.headers as any;
    if (typeof rawHeaders.getSetCookie === "function") {
      const setCookies = rawHeaders.getSetCookie();
      for (const cookie of setCookies) {
        headers.append("Set-Cookie", cookie);
      }
    } else if (typeof rawHeaders.entries === "function") {
      // If it's a Headers object without getSetCookie
      for (const [key, value] of rawHeaders.entries()) {
        if (key.toLowerCase() === "set-cookie") {
          headers.append("Set-Cookie", value);
        }
      }
    } else {
      // If headers is a plain object Record<string, string | string[]>
      Object.entries(rawHeaders).forEach(([key, value]) => {
        if (key.toLowerCase() === "set-cookie" && value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append("Set-Cookie", v));
          } else {
            headers.append("Set-Cookie", value as string);
          }
        }
      });
    }
  }

  // Return 200 so the actionData is received by the client component, allowing the toast to show.
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify({ status: 200 }), {
    status: 200,
    headers,
  });
};

export default function Logout({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const queryClient = getQueryClientRsc();
  useEffect(() => {
    if (actionData?.status === 200) {
      toast.success(`Successfully logged out`, {
        id: "logout",
      });
      queryClient.clear();
      navigate("/account/signin");
    }
  }, [actionData, navigate]);
  return null;
}
