import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { LitElement, isServer } from 'lit';
import { ssrStyleShim } from '../../index';
import { Type } from '../../misc';

export const ssrShim =
  (features: string[] | string) =>
  (classOrDescriptor: Type<LitElement> | ClassDescriptor): void => {
    if (!isServer) {
      return;
    }

    typeof classOrDescriptor === 'function'
      ? legacyCustomElement(classOrDescriptor, features)
      : standardCustomElement(classOrDescriptor as ClassDescriptor, features);
  };

const legacyCustomElement = (
  clazz: Type<LitElement>,
  features: string[] | string
) => {
  return shimClass(clazz, features);
};

const standardCustomElement = (
  descriptor: ClassDescriptor,
  features: string[] | string
) => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    finisher(clazz: Constructor<LitElement>) {
      return shimClass(clazz, features);
    },
  };
};

function shimClass<T extends Type<LitElement>>(
  target: T,
  features: string[] | string
): any {
  if (
    features === 'style' ||
    (Array.isArray(features) && features.includes('style'))
  ) {
    ssrStyleShim(target);
  }

  return target;
}
