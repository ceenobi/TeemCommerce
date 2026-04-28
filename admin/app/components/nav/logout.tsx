import { LogOut } from "lucide-react";
import { Form } from "react-router";
import { Button } from "../ui/button";

export default function Logout() {
  return (
    <>
      <Form action="/logout" method="post">
        <Button
          type="submit"
          variant={"ghost"}
          className="flex w-fit items-center text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-2 rounded transition-colors duration-200 cursor-pointer"
        >
          <LogOut />
        </Button>
      </Form>
    </>
  );
}
