// @deno-types=https://cdn.jsdelivr.net/npm/@types/diff@5.0.2/index.d.ts
import { Change } from "diff";
import logger from '~/util/log.ts';

const difflog = logger('DIFFLOG');

export abstract class PrintableDiff {
  protected diff: Change[];
  protected label: string;
  protected newLines: boolean;

  public printDiff() {
    difflog.info(this.label);

    if (this.noChangePresent) {
      difflog.write(' - NO CHANGE\n');
    }

    this.diff.forEach(part => {
      // green for additions, red for deletions grey for common parts
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
      difflog.write('\t' + part.value[color]);

      this.newLines && difflog.write('\n');
    });

    difflog.info();
  }

  public get noChangePresent(): boolean {
    return this.diff.some(part => !part.added && !part.removed);
  }
}