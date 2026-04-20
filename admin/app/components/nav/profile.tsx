import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Form } from "react-router";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../provider/theme";

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const user = {
    image: "",
    name: "Cobi Mbachu",
    role: "admin",
  };
  const themeIcons = [
    {
      value: "light",
      icon: <Sun />,
    },
    {
      value: "dark",
      icon: <Moon />,
    },
    {
      value: "system",
      icon: <Monitor />,
    },
  ] as const;
  const handleThemeToggle = (value: "light" | "dark" | "system") => {
    setTheme(value);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="md:hidden cursor-pointer relative h-8 w-8 p-0 hover:bg-accent rounded-full border-none"
        aria-label="Profile menu"
      >
        {user?.image ? (
          <img
            className="h-8 w-8 object-cover border-2 border-border hover:border-primary transition-colors rounded-full"
            src={user?.image}
            alt={`${user?.name}'s avatar`}
          />
        ) : (
          <span className="w-8 h-8 border-2 border-border hover:border-primary transition-colors flex items-center justify-center rounded-full">
            {user?.name
              ?.split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()}
          </span>
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hidden md:block cursor-pointer relative h-8 w-8 p-0 rounded-full border-none"
            aria-label="Profile menu"
          >
            {user?.image ? (
              <img
                className="h-8 w-8 object-cover transition-colors rounded-full"
                src={user?.image}
                alt={`${user?.name}'s avatar`}
              />
            ) : (
              <span className="w-8 h-8 transition-colors flex items-center justify-center rounded-full">
                {user?.name
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-sm" align="end" forceMount>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <h1 className="truncate text-sm font-medium leading-none text-CharcoalBlack dark:text-WhiteNeutral">
                {user?.name}
              </h1>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex justify-between items-center">
            <p className="text-sm">Theme</p>
            <div className="flex gap-2">
              {themeIcons.map((themeIcon) => (
                <Button
                  key={themeIcon.value}
                  variant={theme === themeIcon.value ? "outline" : "ghost"}
                  size="icon-sm"
                  onClick={() => handleThemeToggle(themeIcon.value)}
                  className="cursor-pointer rounded-sm"
                  aria-label={themeIcon.value}
                >
                  {themeIcon.icon}
                </Button>
              ))}
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Form
              action="/logout"
              method="post"
              className="flex gap-2 items-center cursor-pointer text-velvet"
            >
              <LogOut />
              <button type="submit" className="cursor-pointer w-auto text-sm">
                Logout
              </button>
            </Form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
