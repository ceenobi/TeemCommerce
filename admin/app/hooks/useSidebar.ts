import { useEffect, useState } from "react";
import { safeGetItem, safeSetItem } from "~/lib/storage";

export default function useSidebar() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedState = safeGetItem("sidebarTeemCommerce");
    if (savedState !== null) {
      setIsOpenSidebar(savedState === "true");
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      safeSetItem("sidebarTeemCommerce", String(isOpenSidebar));
    }
  }, [isOpenSidebar, isMounted]);

  return {
    isOpenSidebar,
    setIsOpenSidebar,
  };
}
