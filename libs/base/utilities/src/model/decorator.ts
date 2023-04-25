import { LitElement, UpdatingElement } from 'lit';

interface BaseFieldOrMethodContext {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializer?: () => any;
  extras?: DecoratorContext[];
  descriptor?: PropertyDescriptor;
  [key: string]: unknown;
}

export interface TargetContext {
  new (): unknown;
  [key: string | symbol]: unknown;
}

export interface ClassContext {
  kind: 'class';
  elements: FieldOrMethodContext[];
  finisher?: (clazz: TargetContext) => TargetContext | void;
}

export interface FieldOrMethodContext extends BaseFieldOrMethodContext {
  finisher?: (clazz: TargetContext) => TargetContext | void;
}

export interface TargetDecorator extends LitElement {
  [key: string | symbol]: unknown;
}

export interface DecoratorContext extends BaseFieldOrMethodContext {
  finisher?: (
    clazz: typeof UpdatingElement & TargetDecorator
  ) => typeof UpdatingElement | void;
}

export type DecoratorResult<T> = (
  context: T extends DecoratorContext ? DecoratorContext : TargetDecorator,
  name?: PropertyKey
) => void;
