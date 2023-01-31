export interface InstanceWithStatic<T> {
  constructor: {
    [key: string | symbol]: T;
  };
}

/**
 * Gets static property value from class instance
 */
export const getStaticProp = <T>(
  clazz: InstanceWithStatic<T>,
  key: string | symbol
): T => clazz.constructor[key] ?? Object.getPrototypeOf(clazz.constructor)[key];
