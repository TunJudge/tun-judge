export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  size /= 1024;
  if (size < 1024) return `${roundN(size)} KB`;
  size /= 1024;
  if (size < 1024) return `${roundN(size)} MB`;
  size /= 1024;
  return `${roundN(size)} GB`;
}

function roundN(value: number, digits = 2) {
  const tenToN = 10 ** digits;
  return Math.round(value * tenToN) / tenToN;
}
