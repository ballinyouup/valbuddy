import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJSON(json: string) {
  let j;
  try {
    j = JSON.parse(atob(json));
  } catch {
    console.log("Error parsing JSON")
    j = [];
  }
  return j;
}
