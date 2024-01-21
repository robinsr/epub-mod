import logger from "~/util/log.ts";
import { AccessNode } from '../dom/defs.ts';
import { validators, validateSchema, taskSchema } from './task-config.ts';
import { newResult } from './task-result.ts';
import {
  AmendAttrAddReplaceOp,
  AmendAttrArgs,
  AmendAttrOp,
  AmendAttrRegexOp,
  TaskDefinition,
  TransformTaskType,
} from './defs.ts';

const TASK_NAME = 'amend-attrs';

const log = logger(import.meta.url);

const { array, forbid, object, oneOf, req, string } = validators;


const attributeSchema = object({
  attr: string().req(),
  op: oneOf('add', 'remove', 'replace', 'regex'),
  value: string().opt()
    .when('op', [ {
      is: 'add', then: req().messages({
        'any.required': 'Property "value" is required for operation "add"',
        'string.empty': 'Property "value" cannot be empty. Did you mean to use operation "remove"'
      })
    }, {
      is: 'replace',
      then: req().messages({
        'any.required': 'Property "value" is required for operation "replace"',
        'string.empty': 'Property "value" cannot be empty. Did you mean to use operation "remove"'
      })
    }, {
      is: 'remove',
      then: forbid().messages({
        'any.unknown': 'Property "value" is not needed for operation "remove"'
      })
    }, {
      is: 'regex',
      then: forbid().messages({
        'object.unknown': 'For operation "regex", use properties "match" and "replace"'
      })
    }
  ]),
  match: string().req() .when('op', {
    is: 'regex',
    then: req().messages({
      'any.required': 'Property "match" is required for operation "regex"'
    }),
    otherwise: forbid().messages({
      'any.unknown': 'Property "match" not allowed unless using operation "regex"'
    })
  }),
  replace: string().req().allow('').when('op', {
    is: 'regex',
    then: req().messages({
      'any.required': 'Property "replace" is required for operation "regex"'
    }),
    otherwise: forbid().messages({
      'any.unknown': 'property "replace" not allowed unless using operation "regex"'
    })
  })
});

const schema = {
  attrs: array().items(attributeSchema)
};

const configure = (config: AmendAttrArgs): TaskDefinition<AmendAttrArgs> => ({
  name: config.name,
  selector: config.selector,
  validate: (args) => validateSchema(taskSchema.append(schema), args, `${args.name}`),
  parse: (args) => args,
  transform: (config, node) => {
    const applyUpdates = (node: AccessNode, args: AmendAttrOp) => {
      let { attr, op } = args;

      let currentVal = node.getAttr(attr);

      if (op === 'regex') {
        let { match, replace } = (<AmendAttrRegexOp> args);

        if (!currentVal) {
          log.warn(`Cannot update attribute ${attr} on ${node.tag}`);
          return node;
        }

        let replaceVal = currentVal.replace(new RegExp(match), replace);
        node.setAttr(attr, replaceVal);
      }

      let stringVal = String((<AmendAttrAddReplaceOp> args).value).valueOf();

      if (op === 'add') {
        node.setAttr(attr, stringVal);
      }

      if (op === 'replace' && node.hasAttr(attr)) {
        node.setAttr(attr, stringVal);
      }

      if (op === 'remove') {
        node.removeAttr(attr);
      }

      if (node.getAttr(attr) === '') {
        node.removeAttr(attr);
      }

      return node;
    }

    let r = newResult(`${config.name} (${TASK_NAME})`);

    if (node.tag !== 'body') {
      let newNode = config.attrs.reduce(applyUpdates, node.clone());
      return r.replace(node, newNode).final();
    } else {
      // Replacing the body element with a clone has major consequences
      config.attrs.reduce(applyUpdates, node);
      return r.final();
    }
  }
});

const AmendAttrs: TransformTaskType<AmendAttrArgs> = {
  type: TASK_NAME,
  configure
}

export default AmendAttrs;
