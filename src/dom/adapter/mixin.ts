

export type MixinFunc = <A extends object, B extends object>(a: A) => A & B;

/**
 * Naive approach for mixin functionality. It does the job, but requires manually
 * building an object and asserting the type afterwards
 * @param target
 * @param source
 */
export const mixin = <T extends object, S extends object> (target: T, source: S): T & S => {
  const keys = Reflect.ownKeys(source);
  for (let i = 0; i < keys.length; ++i) {
    if (keys[i] in target) {
      continue;
    }

    Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i])!);
  }

  return target as T & S;
};
