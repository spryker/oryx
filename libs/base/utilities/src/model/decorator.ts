import { LitElement, UpdatingElement } from 'lit';

export interface TargetDecorator extends LitElement {
  [key: string | symbol]: unknown;
}

export interface DecoratorContext {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: () => any;
  extras?: DecoratorContext[];
  finisher?: (
    clazz: typeof UpdatingElement & TargetDecorator
  ) => typeof UpdatingElement | void;
  descriptor?: PropertyDescriptor;
  [key: string]: unknown;
}

export type DecoratorResult<T> = (
  context: T extends DecoratorContext ? DecoratorContext : TargetDecorator,
  name?: PropertyKey
) => void;
