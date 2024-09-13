export function cleanFields<T>(object: T, ...keys: (keyof T)[]): T {
  for (const key of keys) {
    delete object[key];
  }

  return object;
}
