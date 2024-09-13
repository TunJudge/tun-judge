export function paramsToString(params: Record<string, unknown>): string {
  return Object.entries(params)
    .map(([key, value]) => {
      try {
        return `${key}: ${JSON.stringify(value)}`;
      } catch {
        return `${key}: ${value}`;
      }
    })
    .join(', ');
}
