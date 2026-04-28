import { cn } from "~/lib/utils";
import Logo from "./logo";
import Drawer from "./drawer";
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
        "fixed top-0 z-40 border-b dark:border-WhiteNeutral/20 bg-background/50 dark:bg-DarkNight/20 backdrop-blur supports-backdrop-filter:bg-background/50 w-full",
        isOpenSidebar ? "lg:w-[calc(100%-250px)]" : "lg:w-[calc(100%-60px)]",
      )}
    >
      <div className="lg:container mx-auto flex justify-between items-center py-2.25 px-4 lg:px-8">
        <h1 className="hidden md:block truncate text-sm text-muted-foreground font-medium tracking-light">
          Store Manager
        </h1>
        <div className="md:hidden">
          <Logo classname="text-2xl" />
        </div>
        <div className="flex gap-2 items-center">
          <GlobalSearch />
          <Notifcation />
          <Profile />
          <Drawer />
        </div>
      </div>
    </header>
  );
}
