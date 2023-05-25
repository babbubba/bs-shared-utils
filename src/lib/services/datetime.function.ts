export function getSecondsToDate(date:Date | undefined): number {
  if(!date) return 0;
  return Math.round(Math.abs((date.getTime() - new Date().getTime()) / 1000));
}
