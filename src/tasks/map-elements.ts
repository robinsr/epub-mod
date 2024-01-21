import logger from '~/util/log.ts';
import {
  TransformFunction,
  TransformTaskType,
  MapElementsArgs,
  MapElementsConfig,
  ValidationResult
} from './defs.ts';
import {
  validateSchema,
  validators,
  taskSchema
} from './task-config.ts'
import { parseElementMap, mapNode } from "../dom/element-map.ts";
import { newResult } from './task-result.ts';


const TASK_NAME = 'map-elements';

const log = logger(import.meta.url);

const argsSchema = {
  map: validators.elementMap()
}

const validate = (args: MapElementsArgs): ValidationResult => {
  return validateSchema(taskSchema.append(argsSchema), args, TASK_NAME);
}

const parse = (args: MapElementsArgs): MapElementsConfig => {
  let map = parseElementMap(args.map);
  let mapKeys = Object.keys(map);

  return { ...args, mapKeys, map };
}

const transform: TransformFunction<MapElementsConfig> = (config, node, dom) => {
  let r = newResult(`${config.name} (${TASK_NAME})`);
  let { mapKeys, map } = config;

  let matchKey = mapKeys.find(key => node.matches(key));

  log.debug(`elem matches "${matchKey}"?:`);

  if (!matchKey) {
    return r.error(`No transform key found for element ${node.selector}`);
  }

  let matchProps = map[matchKey].from;
  let newProps = map[matchKey].to;

  log.debug('Match Props:', matchProps);
  log.debug('New Props:', newProps);

  log.debug(node.attrs);

  let newNode = dom.newNode(mapNode(node, matchProps, newProps));

  return r.replace(node, newNode).final();
}


const MapElements: TransformTaskType<MapElementsArgs, MapElementsConfig> = {
  type: TASK_NAME,
  configure: (config) => {
    let { name, selector } = config;
    return { name, selector, parse, transform, validate }
  }
}

export default MapElements;
