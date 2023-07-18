import { ClassDescriptor } from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';

export const optionsKey = Symbol.for('default-options');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassType<T = Record<string, any>> = Type<LitElement & { options?: T }> & {
  [optionsKey]?: T;
};

declare module '@spryker-oryx/core' {
  interface ComponentStatic {
    [optionsKey]?: Record<string, unknown>;
  }
}

function defaultOptionsClass(
  clazz: ClassType,
  options: Record<string, unknown>
): ClassType {
  clazz[optionsKey] = {
    floatLabel: true,
    ...clazz[optionsKey],
    ...options,
  };
  return clazz;
}

const legacyDefaultOptions = (
  clazz: ClassType,
  options: Record<string, unknown>
) => {
  return defaultOptionsClass(clazz, options);
};

const standardDefaultOptions = (
  descriptor: ClassDescriptor,
  options: Record<string, unknown>
) => {
  return {
    ...descriptor,
    finisher(clazz: ClassType): ClassType {
      return defaultOptionsClass(clazz, options);
    },
  };
};

export const defaultOptions =
  <T extends ClassType>(
    options: T extends ClassType<infer K> ? K : Record<string, unknown>
  ) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (classOrDescriptor: T): any =>
    typeof classOrDescriptor === 'function'
      ? legacyDefaultOptions(classOrDescriptor, options)
      : standardDefaultOptions(classOrDescriptor, options);
