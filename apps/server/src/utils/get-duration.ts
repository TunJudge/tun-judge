export function getDuration(oldTime: number): number {
  return Math.round(performance.now() - oldTime);
}
