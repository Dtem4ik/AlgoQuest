/** Склеивает классы, отбрасывая пустые значения. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
