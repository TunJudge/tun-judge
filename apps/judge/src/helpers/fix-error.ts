export function fixError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(JSON.stringify(error));
}
