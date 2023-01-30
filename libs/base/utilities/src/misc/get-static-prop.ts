export interface InstanceWithStatic<T> {
  constructor: {
    __proto__: Record<string | symbol, T>;
  } & { [key: string | symbol]: T };
}

/**
 * Gets static property value from class instance
 */
export const getStaticProp = <T>(
  clazz: InstanceWithStatic<T>,
  key: string | symbol
): T => clazz.constructor[key] ?? clazz.constructor.__proto__[key];
