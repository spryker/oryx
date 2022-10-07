import { LitElement, UpdatingElement } from 'lit';

export interface DecoratorContext {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: () => any;
  extras?: DecoratorContext[];
  finisher?: (clazz: typeof UpdatingElement) => typeof UpdatingElement | void;
  descriptor?: PropertyDescriptor;
  [key: string]: unknown;
}

export interface TargetDecorator extends LitElement {
  [key: string | symbol]: unknown;
}
