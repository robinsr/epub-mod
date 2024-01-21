import { DomAdapter } from '~/dom/defs.ts';
import { PrintableDiff } from '~/diff/print-diff.ts';


export type ChangeType = 'REMOVE-NODE' | 'REPLACE-NODE' | 'MODIFY-NODE';

// abstract class DocumentChange extends PrintableDiff {
//   public abstract get type(): ChangeType;
//   public abstract applyChange(adapter: DomAdapter): void;
// }

export interface DocumentChange extends PrintableDiff {
  get type(): ChangeType;
  applyChange(adapter: DomAdapter): void;
}

export default DocumentChange;
