export function formatDate(date: string | Date) {
  const d = new Date(date);

  const monthDayYear = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekday = d.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return `${monthDayYear} – ${weekday}`;
}
