import { DomNode } from '~/dom/defs.ts';
import { walkTree } from '~/tasks/task-utils.ts';
import { newResult } from '~/tasks/task-result.ts';
import { validators, taskSchema, validateSchema } from '~/tasks/task-config.ts';
import {
  ChangeCaseArgs,
  TransformFunction,
  TransformTaskType,
  ValidationResult,
  VoidDomFunction
} from "~/tasks/defs.ts";

const TASK_NAME = 'change-case';

const toTitleCase = (n: DomNode) => {
  n.text = n.text.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

const toUpperCase = (n: DomNode) => {
  n.text = n.text.toUpperCase();
}

const toLowerCase = (n: DomNode) => {
  n.text = n.text.toLowerCase();
}

const transformMap: Record<string, VoidDomFunction> = {
  'lower-case': toLowerCase,
  'title-case': toTitleCase,
  'upper-case': toUpperCase,
}

const changeCaseSchema = {
  case: validators.oneOf(...Object.keys(transformMap))
};

const validate = (args: ChangeCaseArgs): ValidationResult => {
  return validateSchema(taskSchema.append(changeCaseSchema), args, TASK_NAME);
}

const parse = (args: ChangeCaseArgs): ChangeCaseArgs => args;

const transform: TransformFunction<ChangeCaseArgs> = (config, node) => {

  let textFunc = transformMap[config.case];

  let r = newResult(`${config.name} (${TASK_NAME})`);

  if (!node.text) {
    return r.error('Node contains no text');
  }

  let newNode = node.clone();

  if (node.hasChildren) {
    walkTree(newNode, textFunc);
  } else {
    textFunc(newNode);
  }

  if (node.text === newNode.text) {
    return r.error('No text changed');
  }

  return r.modify(node, newNode).final();
}

const ChangeCase: TransformTaskType<ChangeCaseArgs, ChangeCaseArgs> = {
  type: TASK_NAME,
  configure: (config) => {
    let { name, selector } = config;
    return { name, selector, validate, parse, transform };
  }
}

export default ChangeCase;
