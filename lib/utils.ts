import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenNumber(value: number) {
  const formatter = new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 2,
  });
  if (value >= 1_000_000_000) {
    const no = formatter.format(value / 1_000_000_000);
    return `${no}B`;
  }
  if (value >= 1_000_000) {
    const no = formatter.format(value / 1_000_000);
    return `${no}M`;
  }
  if (value >= 1_000) {
    const no = formatter.format(value / 1_000);
    return `${no}K`;
  }
  return value;
}
