import logger from "~/util/log.ts";
import { IFileAdapter } from "~/dom/defs.ts";
import FileDiff from '~/diff/file-diff.ts';
import { existsSync } from 'std/fs/exists.ts';


const log = logger(import.meta.url);

class FileAdapterImpl implements IFileAdapter {

  constructor(public filename: string) {
    log.debug('Creating FileAdapter for file: ', filename);
  }

  getContents(): string {
    if (!this.filename) {
      throw new Error('No filename');
    }

    if (!existsSync(this.filename)) {
      throw new Error(`File not found: ${this.filename}`);
    }

    const decoder = new TextDecoder('utf-8');
    return decoder.decode(Deno.readFileSync(this.filename))
  }

  diffWith(updated: string) {
    new FileDiff(this.getContents(), updated, this.filename).printDiff();
  }

  saveContents(contents: string) {
    const encoder = new TextEncoder();
    Deno.writeFileSync(this.filename, encoder.encode(contents));
  }

  get target() {
    return this.filename;
  }
}


const FileAdapter = (filename: string): IFileAdapter => {
  return new FileAdapterImpl(filename);
}

export default FileAdapter;
