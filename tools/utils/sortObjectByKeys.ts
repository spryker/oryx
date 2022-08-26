export const sortObjectByKeys = <T extends Record<string, unknown>>(
  source: T
): T => {
  return Object.keys(source)
    .sort()
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: source[key],
      }),
      {}
    ) as T;
};
