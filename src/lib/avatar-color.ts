const AVATAR_COLORS = [
  "var(--color-purple)",
  "var(--color-blue)",
  "var(--color-orange)",
  "var(--color-cyan)",
  "var(--color-green-deep)",
];

export function avatarColorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function initialFor(fullName: string) {
  return fullName.trim().charAt(0).toUpperCase() || "?";
}
