import { Button } from "../ui/button";
import { Command, Search } from "lucide-react";
import { useState } from "react";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex h-9 w-56 justify-between text-muted-foreground hover:text-foreground"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search...</span>
        </div>
        <div className="flex items-center gap-1 text-xs bg-muted px-1.5 py-0.5 rounded">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </Button>
    </>
  );
}
