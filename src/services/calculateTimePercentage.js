export const calculateTimePercentage = (startTime, endTime) => {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now >= end) return 0;
  if (now <= start) return 100;

  const total = end - start;
  const remaining = end - now;
  return Math.round((remaining / total) * 100);
}