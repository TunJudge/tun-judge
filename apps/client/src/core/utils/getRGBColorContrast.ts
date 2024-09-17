export function getRGBColorContrast(rgb: string): number {
  rgb = rgb.replaceAll('#', '');

  const red = Number.parseInt(rgb.slice(0, 2), 16);
  const green = Number.parseInt(rgb.slice(2, 4), 16);
  const blue = Number.parseInt(rgb.slice(4), 16);

  return (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
}
