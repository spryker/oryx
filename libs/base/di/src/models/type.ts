export interface Type<T, A extends any[] = any[]> extends Function {
  new (...args: A): T;
  prototype: T;
}

export type InferType<T> = T extends Type<infer R> ? R : never;
