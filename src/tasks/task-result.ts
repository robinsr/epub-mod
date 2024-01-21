import { AccessNode } from '../dom/defs.ts';
import { isEmpty } from 'ramda';
import ReplaceAction from '../diff/replace-action.ts';
import RemoveAction from '../diff/remove-action.ts';
import ModifyAction from '../diff/modify-action.ts';
import DocumentChange from '../diff/doc-change.ts';

export default class TaskResult {
  docChanges: DocumentChange[] = [];
  error: string = null;

  get noChange() {
    let fields = [ this.docChanges, this.error ];
    let allEmpty = fields.every(f => isEmpty(f));

    if (allEmpty) return true;

    return this.docChanges.flat()
      .every(change => change.noChangePresent)
  }

  public get remove(): DocumentChange[] {
    return this.docChanges.filter(dc => dc.type === 'REMOVE-NODE');
  }

  public get replace(): DocumentChange[] {
    return this.docChanges.filter(dc => dc.type === 'REPLACE-NODE');
  }

  public get modify(): DocumentChange[] {
    return this.docChanges.filter(dc => dc.type === 'MODIFY-NODE');
  }

  static Builder = class {
    private readonly taskName: string;
    private result = new TaskResult();

    constructor(taskName: string) {
      this.taskName = taskName;
    }

    remove(node: AccessNode) {
      this.result.docChanges.push(new RemoveAction(node, this.taskName));
      return this;
    }

    replace(oldNode: AccessNode, newNode: AccessNode): this {
      this.result.docChanges.push(new ReplaceAction(oldNode, newNode, this.taskName));
      return this;
    }

    modify(target: AccessNode, takeFrom: AccessNode) {
      this.result.docChanges.push(new ModifyAction(target, takeFrom, this.taskName));
      return this;
    }

    error(err: string) {
      this.result.error = err;
      return this.final();
    }

    final(): TaskResult {
      return this.result;
    }
  }
}

export const newResult = (taskName = 'Unknown') =>  {
  return new TaskResult.Builder(taskName);
}

export const error = (err: string, taskName = 'Unknown'): TaskResult => {
  return new TaskResult.Builder(taskName).error(err);
}

