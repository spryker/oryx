type Constructor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};

export interface TargetContext {
  [key: string | symbol]: unknown;
}

export interface DecoratorContext {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializer?: () => any;
  extras?: DecoratorContext[];
  finisher?: <T>(clazz: Constructor<T>) => Constructor<T> | void;
  descriptor?: PropertyDescriptor;
  [key: string]: unknown;
}

export interface ClassContext {
  kind: 'class';
  finisher?: <T>(clazz: Constructor<T>) => Constructor<T> | void;
}
