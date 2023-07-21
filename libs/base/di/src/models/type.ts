// TODO: remove when fix circular dependency utilities <=> di
export interface Type<T, A extends any[] = any[]> extends Function {
  new (...args: A): T;
  prototype: T;
}
