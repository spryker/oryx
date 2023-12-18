function getStartOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function getWeek(offset = 0): { start: Date; end: Date } {
  const today = new Date();
  const startOfWeek = getStartOfDay(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + offset * 7
    )
  );
  const endOfWeek = getEndOfDay(
    new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
  );

  return { start: startOfWeek, end: endOfWeek };
}
