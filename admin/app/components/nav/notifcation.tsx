import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";

export default function Notifcation() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const unreadCount = 7;
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 cursor-pointer hovver:text-velvet"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge className="bg-velvet text-CottonCandy absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-96 p-0 shadow-lg border rounded-sm"
      >
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-base">Notifications</h4>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
