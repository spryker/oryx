import { LitElement, PropertyDeclaration } from 'lit';
import { property } from 'lit/decorators.js';
import { DecoratorContext } from '../../model';
import { SettableSignal } from '../core';
import { signal } from '../signal';

type SignalKeys = {
  [key: symbol]: SettableSignal<any>;
};

function createSignalPropertyDescriptor<T extends LitElement & SignalKeys>(
  propertyKey: string | symbol
) {
  const signalKey = Symbol.for(`${String(propertyKey)}Signal`);

  return {
    get(this: SignalKeys): string | undefined {
      if (!this[signalKey]) {
        this[signalKey] = signal(
          undefined as undefined | any
        ) as SettableSignal<any>;
      }
      return this[signalKey]();
    },
    set(this: SignalKeys, value: string): void {
      if (!this[signalKey]) {
        this[signalKey] = signal(value);
      } else {
        this[signalKey].set(value);
      }
      (this as any).requestUpdate(propertyKey);
    },
    enumerable: true,
    configurable: true,
  };
}

function legacySignalProperty<T extends LitElement>(
  options: PropertyDeclaration,
  target: T,
  propertyKey: keyof T
) {
  Object.defineProperty(
    target.constructor.prototype,
    propertyKey,
    createSignalPropertyDescriptor<T & SignalKeys>(propertyKey as string)
  );
  return property({ ...options, noAccessor: true })(
    target,
    propertyKey as string
  );
}

function standardSignalProperty<T extends LitElement>(
  options: PropertyDeclaration,
  protoOrDescriptor: DecoratorContext
) {
  const { elements } = protoOrDescriptor;
  const propertyKey = protoOrDescriptor.key as keyof T;
  const descriptor = {
    kind: 'method',
    elements,
    key: propertyKey,
    placement: 'prototype',
    descriptor: createSignalPropertyDescriptor<T & SignalKeys>(
      propertyKey as string
    ),
  };
  return property({ ...options, noAccessor: true })(descriptor);
}

export function signalProperty(options?: PropertyDeclaration) {
  return <T extends LitElement>(
    protoOrDescriptor: T | DecoratorContext,
    name?: PropertyKey
  ): any =>
    name !== undefined
      ? legacySignalProperty(options!, protoOrDescriptor as T, name as keyof T)
      : standardSignalProperty(options!, protoOrDescriptor as DecoratorContext);
}
