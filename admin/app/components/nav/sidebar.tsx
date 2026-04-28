import { cn } from "~/lib/utils";
import Logo from "./logo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sideBarLinks } from "~/lib/constants";
import { NavLink, useLocation } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logout from "./logout";
import type { UserData } from "~/lib/schemaValidations";

type SidebarProps = {
  isOpenSidebar: boolean;
  setIsOpenSidebar: (value: boolean) => void;
  user?: UserData;
};

export default function SidebarProvider({
  isOpenSidebar,
  setIsOpenSidebar,
  user,
}: SidebarProps) {
  const toggleSidebar = () => setIsOpenSidebar(!isOpenSidebar);
  return (
    <>
      <Sidebar
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
        user={user}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
}

function Sidebar({
  isOpenSidebar,
  user,
  toggleSidebar,
}: SidebarProps & { toggleSidebar: () => void }) {
  const location = useLocation();
  const path = location.pathname;
  return (
    <aside
      className={cn(
        `hidden lg:block bg-white dark:bg-CharcoalBlack border-r dark:border-WhiteNeutral/20 min-h-screen top-0 fixed z-50 transition-all duration-300 ease-in-out`,
        isOpenSidebar ? "lg:w-62.5" : "lg:w-12",
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "flex items-center absolute top-0 z-10 w-full border-b dark:border-WhiteNeutral/20",
            isOpenSidebar ? "px-2 py-3.75" : "justify-center py-4",
          )}
        >
          <Logo isOpenSidebar={isOpenSidebar} classname="text-base" />
          <button
            onClick={toggleSidebar}
            className={cn(
              "cursor-pointer transition-all duration-300 ease-in-out absolute top-4 translate-x-1/2 rounded-full border",
              isOpenSidebar ? "right-0" : "-right-0.75",
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
                          `tracking-normal transition-all duration-300 ease-in-out w-full p-1.25 flex items-center gap-2 text-sm dark:text-WhiteNeutral ${
                            isActive ||
                            path.split("/")[1] === child.href.split("/")[1]
                              ? "w-full border-0 border-BrightTealBlue bg-DarkNight/10 dark:bg-DarkBlue text-CharcoalBlack"
                              : "hover:bg-DarkNight/5 hover:dark:bg-DarkBlue/30 hover:text-BrightTealBlue hover:tracking-widest text-CharcoalBlack/70"
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
                              <child.icon size={18} />
                              <span
                                className={`cursor-pointer transition ease-in-out duration-300 ${isOpenSidebar ? "hidden md:block" : "hidden"}`}
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
        <div className="absolute bottom-2 z-10 w-full py-2 space-y-2">
          <Separator className="bg-WhiteNeutral/20" />
          <div className="flex gap-2 items-center justify-center px-2">
            <Avatar>
              <AvatarImage src={"https://github.com/shadcn"} />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOpenSidebar && (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.role}
                  </span>
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
