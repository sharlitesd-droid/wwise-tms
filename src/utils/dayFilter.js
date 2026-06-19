export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function getWeekDate(dayIndex) {
  const now = new Date();
  const monday = new Date(now);
  const current = (now.getDay() + 6) % 7;
  monday.setDate(now.getDate() - current + dayIndex);
  return monday;
}

export function isDayFilterActive(selectedDay, todayIndex) {
  return selectedDay !== todayIndex;
}

export function getDayFilterLabel(selectedDay) {
  const date = getWeekDate(selectedDay);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function matchesDay(timestamp, selectedDay) {
  if (!timestamp) return false;
  const dayStr = getWeekDate(selectedDay).toDateString();
  return new Date(timestamp).toDateString() === dayStr;
}

export function filterTasksByDay(tasks, selectedDay, todayIndex) {
  if (selectedDay === todayIndex) return tasks;
  return tasks.filter(
    (task) => matchesDay(task.dueDate, selectedDay) || matchesDay(task.createdAt, selectedDay)
  );
}

export function filterItemsByCreatedDay(items, selectedDay, todayIndex) {
  if (selectedDay === todayIndex) return items;
  return items.filter((item) => matchesDay(item.createdAt, selectedDay));
}

export function filterByTimestampDay(items, selectedDay, todayIndex) {
  if (selectedDay === todayIndex) return items;
  return items.filter((item) => matchesDay(item.timestamp || item.createdAt, selectedDay));
}
