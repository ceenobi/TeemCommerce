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
      <Tent className="text-BrightTealBlue" size={24} />
      {isOpenSidebar && (
        <span className={`font-bold ${classname}`}>Teem Commerce</span>
      )}
    </Link>
  );
}
