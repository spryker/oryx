import type { PropertyValues } from '@lit/reactive-element';
import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { isClient, Type } from '@spryker-oryx/typescript-utils';
import { LitElement } from 'lit';

const DEFER_HYDRATION = Symbol('deferHydration');
export const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
export const HYDRATING = '$__HYDRATING';

export interface PatchableLitElement extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-new
  new (...args: any[]): PatchableLitElement;
  _$needsHydration?: boolean;
}

export const hydratable =
  (mode?: string) =>
  (classOrDescriptor: Type<HTMLElement> | ClassDescriptor): void =>
    typeof classOrDescriptor === 'function'
      ? legacyCustomElement(classOrDescriptor, mode)
      : standardCustomElement(classOrDescriptor as ClassDescriptor, mode);

const legacyCustomElement = (clazz: Type<HTMLElement>, mode?: string) => {
  return hydratableClass(clazz, mode);
};

const standardCustomElement = (descriptor: ClassDescriptor, mode?: string) => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    finisher(clazz: Constructor<PatchableLitElement>) {
      return hydratableClass(clazz, mode);
    },
  };
};

function hydratableClass<T extends Type<HTMLElement>>(
  target: T,
  mode?: string
): any {
  return class extends (target as any) {
    [DEFER_HYDRATION] = false;
    constructor(...args: any[]) {
      super();
      this.setAttribute('hydratable', mode ?? '');
      if (isClient() && this.shadowRoot) {
        this[DEFER_HYDRATION] = true;
        return;
      }
    }

    connectedCallback() {
      if (this[DEFER_HYDRATION]) {
        return;
      }
      super.connectedCallback();
    }

    update(changedProperties: PropertyValues) {
      if (this[DEFER_HYDRATION]) {
        return;
      }
      if (this._$needsHydration) {
        this[HYDRATING] = true;
      }
      super.update(changedProperties);
      this[HYDRATING] = false;
    }

    [HYDRATE_ON_DEMAND]() {
      const prototype = Object.getPrototypeOf(Object.getPrototypeOf(this));
      if (prototype[HYDRATE_ON_DEMAND]) {
        prototype[HYDRATE_ON_DEMAND].call(this);
      }
      if (this.renderRoot) {
        return;
      }

      this[DEFER_HYDRATION] = false;
      this.removeAttribute('defer-hydration');
      prototype.connectedCallback.call(this);
    }
  };
}
