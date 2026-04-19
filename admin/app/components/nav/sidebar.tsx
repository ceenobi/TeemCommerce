import { cn } from "~/lib/utils";
import Logo from "./logo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sideBarLinks } from "~/lib/constants";
import { NavLink, useLocation } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logout from "./logout";

type SidebarProps = {
  isOpenSidebar: boolean;
  setIsOpenSidebar: (value: boolean) => void;
  userRole?: "member" | "admin" | "super_admin";
};

export default function SidebarProvider({
  isOpenSidebar,
  setIsOpenSidebar,
  userRole,
}: SidebarProps) {
  const toggleSidebar = () => setIsOpenSidebar(!isOpenSidebar);
  return (
    <>
      <Sidebar
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
        userRole={userRole}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
}

function Sidebar({
  isOpenSidebar,
  setIsOpenSidebar,
  userRole,
  toggleSidebar,
}: SidebarProps & { toggleSidebar: () => void }) {
  const location = useLocation();
  const path = location.pathname;
  return (
    <aside
      className={cn(
        `hidden lg:block bg-white/2 border border-white/10 backdrop-blur-3xl min-h-screen top-0 fixed z-50 transition-all duration-300 ease-in-out border-r shadow`,
        isOpenSidebar ? "lg:w-[250px]" : "lg:w-[60px]",
      )}
    >
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-BrightTealBlue/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative">
        <div
          className={cn(
            "flex items-center py-[14px] absolute top-0 z-10 w-full",
            isOpenSidebar ? "px-2" : "justify-center",
          )}
        >
          <Logo isOpenSidebar={isOpenSidebar} classname="text-lg" />
          <button
            onClick={toggleSidebar}
            className={cn(
              "cursor-pointer transition-all duration-300 ease-in-out absolute top-[16px] translate-x-1/2 rounded-full border",
              isOpenSidebar ? "right-0" : "right-[-3px]",
            )}
          >
            {isOpenSidebar ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
        <div className="pt-16 flex flex-col h-[calc(100vh-0px)]">
          <div className="flex-1 overflow-y-auto">
            {sideBarLinks.map((item) => (
              <div key={item.title} className="my-1">
                <div className="flex flex-col gap-2 pt-4">
                  {item.children.map((child: any) => (
                    <div key={child.name}>
                      <NavLink
                        to={child.href}
                        key={child.name}
                        className={({ isActive }) =>
                          `tracking-widest transition-all duration-300 ease-in-out w-full p-2 flex items-center gap-2 text-sm font-medium ${
                            isActive ||
                            path.split("/")[1] === child.href.split("/")[1]
                              ? "font-bold w-full border-l-4 border-0 border-BrightTealBlue bg-DarkNight/90 text-BrightTealBlue"
                              : "hover:bg-DarkNight/30 hover:text-BrightTealBlue hover:tracking-[0.2em]"
                          } ${isOpenSidebar ? "" : "justify-center"}`
                        }
                        viewTransition
                        end
                        prefetch="intent"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={`flex items-center gap-2 cursor-pointer px-2`}
                            >
                              <child.icon size={20} />
                              <span
                                className={`text-sm cursor-pointer transition ease-in-out duration-300 ${isOpenSidebar ? "hidden md:block" : "hidden"}`}
                              >
                                {child.name}
                              </span>
                            </span>
                          </TooltipTrigger>
                          {!isOpenSidebar ? (
                            <TooltipContent side="right">
                              <p className="text-xs">{child.name}</p>
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-2 z-10 w-full p-2 space-y-2">
          <Separator />
          <div className="flex gap-2 items-center justify-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {isOpenSidebar && (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
                <Logout />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
