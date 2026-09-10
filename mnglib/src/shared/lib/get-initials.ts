const MAX_INITIALS = 3;

export function getInitials(title: string, maxChars: number = MAX_INITIALS) {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, maxChars);
}
