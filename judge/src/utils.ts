import { dots } from 'cli-spinners';
import { moveCursor } from 'readline';

let index = 0;

export function startSpinner(): NodeJS.Timeout {
  process.stdout.write(dots.frames[index++]);
  index %= dots.frames.length;
  return setInterval(() => {
    moveCursor(process.stdout, -1, 0);
    process.stdout.write(dots.frames[index++]);
    index %= dots.frames.length;
  }, dots.interval);
}

export function stopSpinner(timeout: NodeJS.Timeout): void {
  clearInterval(timeout);
}
