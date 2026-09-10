export function getFilledStars(rating: number, maxStars: number = 5) {
  return Math.min(Math.round(rating / 2), maxStars);
}
