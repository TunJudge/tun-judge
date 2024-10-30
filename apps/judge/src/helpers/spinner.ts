import { default as CliSpinners } from 'cli-spinners';
import { clearLine, cursorTo, moveCursor } from 'readline';

export class Spinner {
  private readonly interval: NodeJS.Timeout;
  private index: number;

  constructor() {
    this.index = 0;
    this.interval = setInterval(() => {
      moveCursor(process.stdout, -1, 0);
      process.stdout.write(CliSpinners.dots.frames[this.index++]);
      this.index %= CliSpinners.dots.frames.length;
    }, CliSpinners.dots.interval);
  }

  stop(): void {
    clearInterval(this.interval);
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
  }
}
