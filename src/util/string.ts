// @deno-types=deno.d.ts
const { inspect } = Deno;
import { or, isObject, isArray, isFunction } from './deps.ts'

const json_options = {
  colors: true, depth: 12
}

/**
 * Returns the inspection string from {Deno.inspect}
 * for non-primitive objects
 */
export const json = (obj: any): string => {
  const doInspect = or(isObject(obj), or(isArray(obj), isFunction(obj)));
  if (doInspect) {
    return inspect(obj, json_options);
  }
  return obj;
}

/**
 * Adds inward facing arrows around text/object
 */
export const point = (str: string, emphasis = 1): string => {
  /* → */
  const right_arrow = '\u2B95 '.repeat(emphasis);
  /* ← */
  const left_arrow = ' \u2B05'.repeat(emphasis);
  //return `\u2B95 ${str} \u2B05`;
  return [ right_arrow, ' ', str, left_arrow ].join('');
}


export const truncate = (str: string, num: number): string => {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  let truncated = str.slice(0, num) + '...';

  return truncated.replaceAll('\n', '\\n')
}

