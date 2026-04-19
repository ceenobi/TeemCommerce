import { cn } from "~/lib/utils";
import Logo from "./logo";
import Drawer from "./drawer";
import { ThemeToggle } from "./theme-toggle";
import Notifcation from "./notifcation";
import GlobalSearch from "./globalSearch";
import Profile from "./profile";

interface headerProps {
  isOpenSidebar: boolean;
}

export default function Header({ isOpenSidebar }: headerProps) {
  return (
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 z-40 border-b bg-background/50 backdrop-blur supports-backdrop-filter:bg-background/50 w-full",
        isOpenSidebar ? "lg:w-[calc(100%-250px)]" : "lg:w-[calc(100%-60px)]",
      )}
    >
      <div className="lg:max-w-full mx-auto flex justify-between items-center py-[8px] px-4 lg:px-8">
        <h1 className="hidden md:block text-lg font-bold text-foreground truncate uppercase">
          Store Manager
        </h1>
        <div className="md:hidden">
          <Logo classname="text-2xl" />
        </div>
        <GlobalSearch />
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <Notifcation />
          <Profile />
          <Drawer />
        </div>
      </div>
    </header>
  );
}
