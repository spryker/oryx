import { LitElement, UpdatingElement } from 'lit';

export interface DecoratorContext {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: () => any;
  extras?: DecoratorContext[];
  finisher?: (clazz: typeof UpdatingElement) => typeof UpdatingElement | void;
  descriptor?: PropertyDescriptor;
}

export type TargetDecorator = Record<string | symbol, any> & LitElement;
