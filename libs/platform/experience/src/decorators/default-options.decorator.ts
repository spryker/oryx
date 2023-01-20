import { ClassDescriptor } from '@lit/reactive-element/decorators.js';
import { FeatureOptionsService } from '@spryker-oryx/core';
import { resolve, Type } from '@spryker-oryx/di';
import { LitElement } from 'lit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassType = Type<LitElement & { options?: Record<string, any> }>;

function defaultOptionsClass(
  clazz: ClassType,
  options: Record<string, unknown>
): ClassType {
  return class extends clazz {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      resolve(FeatureOptionsService, null)?.addDefaultOptions({
        [this.tagName.toLowerCase()]: options,
      });
    }
  };
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
  (options: Record<string, unknown>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (classOrDescriptor: ClassType): any =>
    typeof classOrDescriptor === 'function'
      ? legacyDefaultOptions(classOrDescriptor, options)
      : standardDefaultOptions(classOrDescriptor, options);
