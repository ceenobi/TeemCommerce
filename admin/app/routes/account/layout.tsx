import { Outlet, useLocation } from "react-router";
import Logo from "~/components/nav/logo";
import { ThemeToggle } from "~/components/nav/theme-toggle";
import { cn } from "~/lib/utils";

export default function AccountLayout() {
  const location = useLocation();
  const paths = ["/account/signin", "/account/signup"];
  const isAuthPage = paths.includes(location.pathname);
  return (
    <>
      <div className="absolute top-4 left-4 right-4 z-10">
        <div
          className={cn(
            "flex items-center",
            isAuthPage ? "justify-end" : "justify-between",
          )}
        >
          {!isAuthPage && <Logo classname="text-xl" />}
          <ThemeToggle />
        </div>
      </div>
      <div className="flex justify-center items-center h-screen">
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}
