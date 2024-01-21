// @deno-types=https://cdn.jsdelivr.net/npm/@types/diff@5.0.2/index.d.ts
import { diffLines } from "diff";
import { PrintableDiff } from '~/diff/print-diff.ts';


class FileDiff extends PrintableDiff {

  constructor(
      private original: string,
      private updated: string,
      private filename: string) {
    super();

    this.diff = diffLines(this.original, this.updated);
    this.label = `All changes for ${this.filename}`;
    this.newLines = false;
  }
}

export default FileDiff;