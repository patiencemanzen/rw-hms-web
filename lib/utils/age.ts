export function computeAge(dateOfBirth: string, today: Date = new Date()): number {
  const [year, month, day] = dateOfBirth.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return 0;
  let age = today.getUTCFullYear() - year;
  const birthdayPassed =
    today.getUTCMonth() + 1 > month ||
    (today.getUTCMonth() + 1 === month && today.getUTCDate() >= day);
  if (!birthdayPassed) age -= 1;
  return Math.max(age, 0);
}
