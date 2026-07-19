const KEY = "wallet_unlocked";

export function isWalletUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEY) === "1";
}

export function setWalletUnlocked() {
  sessionStorage.setItem(KEY, "1");
}
