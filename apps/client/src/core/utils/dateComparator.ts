export function dateComparator<T>(field: keyof T, inv = false): (a: T, b: T) => number {
  return (a, b) =>
    new Date((inv ? b : a)[field] as Date).getTime() -
    new Date((inv ? a : b)[field] as Date).getTime();
}
