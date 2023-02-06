export type Snakify<S extends string> = S extends `${infer P1}${'_'}${infer P2}`
  ? `${Snakify<P1>}_${Snakify<P2>}`
  : S extends `${infer P}`
  ? `${P}`
  : string;

export function snakify(str: string): Snakify<string> {
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1_$2')
    .toLowerCase() as Snakify<string>;
}
