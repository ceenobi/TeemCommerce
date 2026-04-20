import { Outlet } from "react-router";
import Header from "~/components/nav/header";
import SidebarProvider from "~/components/nav/sidebar";
import useSidebar from "~/hooks/useSidebar";

export default function DashboardLayout() {
  const { isOpenSidebar, setIsOpenSidebar } = useSidebar();
  return (
    <section className="min-h-dvh">
      <SidebarProvider
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
        //userRole={user?.role as "member" | "admin" | "super_admin"}
      />
      <div
        className={`transition-all ease-in-out duration-500 ${isOpenSidebar ? "lg:ml-62.5" : "lg:ml-15"}`}
      >
        <Header isOpenSidebar={isOpenSidebar} />
        <Outlet />
      </div>
    </section>
  );
}
