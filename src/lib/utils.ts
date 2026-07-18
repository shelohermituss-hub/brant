import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatHtg(amount: number) {
  return `${Math.round(amount).toLocaleString("fr-FR").replace(/,/g, " ")} HTG`
}
