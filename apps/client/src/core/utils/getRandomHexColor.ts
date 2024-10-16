export function getRandomHexColor(): string {
  return `#${Math.random().toString(16).substring(2, 8)}`;
}
