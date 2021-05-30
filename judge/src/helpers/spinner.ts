import { dots } from 'cli-spinners';
import { clearLine, cursorTo, moveCursor } from 'readline';

export class Spinner {
  private readonly interval: number;
  private index: number;

  constructor() {
    this.index = 0;
    this.interval = setInterval(() => {
      moveCursor(process.stdout, -1, 0);
      process.stdout.write(dots.frames[this.index++]);
      this.index %= dots.frames.length;
    }, dots.interval);
  }

  stop(): void {
    clearInterval(this.interval);
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
  }
}
