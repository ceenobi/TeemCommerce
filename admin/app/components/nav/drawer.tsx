import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, Tent, X } from "lucide-react";
import { sideBarLinks } from "~/lib/constants";

export default function Drawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const path = location.pathname;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          className="relative w-10 h-10 cursor-pointer md:hidden"
        >
          <Menu size={30} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-white dark:bg-white/2 border border-white/10 dark:backdrop-blur-3xl border-l-0 p-0"
        showCloseButton={false}
      >
        <div className="relative flex flex-col h-full px-4 py-2">
          <div className="flex justify-between items-center h-12">
            <NavLink to="/" className="flex gap-1 items-center">
              <Tent className="text-BrightTealBlue" size={24} />
              <span className={`font-bold text-xl`}>Teem Commerce</span>
            </NavLink>
            <SheetClose asChild>
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-full border-VanillaCustard/20 bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  <X size={24} />
                </Button>
              </div>
            </SheetClose>
          </div>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-col gap-8 uppercase items-center">
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
                                ? "font-bold w-full border-BrightTealBlue text-BrightTealBlue"
                                : "hover:bg-DarkNight/30 hover:text-BrightTealBlue"
                            }`
                          }
                          viewTransition
                          end
                          prefetch="intent"
                        >
                          <span
                            className={`flex items-center gap-2 cursor-pointer px-2`}
                          >
                            <child.icon size={20} />
                            <span
                              className={`text-sm cursor-pointer transition ease-in-out duration-300`}
                            >
                              {child.name}
                            </span>
                          </span>
                        </NavLink>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* {links.map((link) => (
                <div key={link.href}>
                  <NavLink
                    to={link.href}˝
                    viewTransition
                    className={({ isActive }) =>
                      `text-3xl font-bold tracking-widest transition-all duration-300 ${
                        isActive
                          ? "text-SoftApricot scale-110"
                          : "text-VanillaCustard hover:text-SoftApricot hover:tracking-[0.2em]"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
