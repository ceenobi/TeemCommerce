import { Tent } from "lucide-react";
import { Link } from "react-router";

export default function Logo({
  isOpenSidebar,
  classname,
}: {
  isOpenSidebar?: boolean;
  classname?: string;
}) {
  return (
    <Link to="/" className="flex gap-1 items-center">
      <Tent className="text-BrightTealBlue" size={22} />
      {isOpenSidebar && (
        <h2
          className={`font-bold ${classname} text-base font-bold text-foreground tracking-tight`}
        >
          Teem Commerce
        </h2>
      )}
    </Link>
  );
}
