import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeOfDay = (name: string): string => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return `Good morning ${name}`;
  } else if (currentHour >= 12 && currentHour < 18) {
    return `Good afternoon ${name}`;
  } else {
    return `Good evening ${name}`;
  }
};

export const formatCurrency = (
  amount: number,
  currency = "NGN",
  display: "symbol" | "narrowSymbol" | "code" | "name" = "symbol",
) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    currencyDisplay: display,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
