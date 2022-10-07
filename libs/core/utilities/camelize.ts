export type CamelCase<S extends string> = S extends
  | `${infer P1}${'-' | '_'}${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

export function camelize<T extends string>(str: T): CamelCase<T> {
  return str
    .toLowerCase()
    .replace(/[^a-z]+(.)/g, (substring, chr) =>
      chr.toUpperCase()
    ) as CamelCase<T>;
}
