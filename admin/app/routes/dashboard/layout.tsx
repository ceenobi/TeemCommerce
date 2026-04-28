import type { Route } from "./+types/layout";
import { Outlet } from "react-router";
import Header from "~/components/nav/header";
import SidebarProvider from "~/components/nav/sidebar";
import useSidebar from "~/hooks/useSidebar";

import {
  authenticatedMiddleware,
  type RouterContext,
} from "~/middleware/auth.middleware";

export const middleware = [authenticatedMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context as unknown as Required<
    Pick<RouterContext, "user" | "cookie">
  >;
  return { user };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { isOpenSidebar, setIsOpenSidebar } = useSidebar();
  const { user } = loaderData;
  console.log(user);
  return (
    <div className="min-h-dvh">
      <SidebarProvider
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
        user={user}
      />
      <main
        className={`overflow-y-auto ${isOpenSidebar ? "lg:ml-62.5" : "lg:ml-12"}`}
      >
        <Header isOpenSidebar={isOpenSidebar} />
        <Outlet />
      </main>
    </div>
  );
}
