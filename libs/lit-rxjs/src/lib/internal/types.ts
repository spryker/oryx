/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdatingElement } from 'lit';

export interface DecoratorContext {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: () => any;
  extras?: DecoratorContext[];
  finisher?: (clazz: typeof UpdatingElement) => typeof UpdatingElement | void;
  descriptor?: PropertyDescriptor;
}
