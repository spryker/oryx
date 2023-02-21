import type { PropertyValues } from '@lit/reactive-element';
import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/di';
import { html, isServer, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';

const DEFER_HYDRATION = Symbol('deferHydration');
const HYDRATION_CALLS = Symbol('hydrationCalls');
export const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
export const HYDRATING = '$__HYDRATING';

export interface PatchableLitElement extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-new
  new (...args: any[]): PatchableLitElement;
  _$needsHydration?: boolean;
}

export const hydratable =
  (mode?: string[] | string, state?: string) =>
  (classOrDescriptor: Type<HTMLElement> | ClassDescriptor): void =>
    typeof classOrDescriptor === 'function'
      ? legacyCustomElement(classOrDescriptor, mode, state)
      : standardCustomElement(
          classOrDescriptor as ClassDescriptor,
          mode,
          state
        );

const legacyCustomElement = (
  clazz: Type<HTMLElement>,
  mode?: string[] | string,
  state?: string
) => {
  return hydratableClass(clazz, mode, state);
};

const standardCustomElement = (
  descriptor: ClassDescriptor,
  mode?: string[] | string,
  state?: string
) => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    finisher(clazz: Constructor<PatchableLitElement>) {
      return hydratableClass(clazz, mode, state);
    },
  };
};

function hydratableClass<T extends Type<HTMLElement>>(
  target: T,
  mode?: string[] | string,
  state?: string
): any {
  return class extends (target as any) {
    [DEFER_HYDRATION] = false;
    private [HYDRATION_CALLS] = 0;

    constructor(...args: any[]) {
      super();
      if (isServer) {
        this.setAttribute('hydratable', mode ?? '');
      }
      if (!isServer && this.shadowRoot) {
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
      const prototype = Array(this[HYDRATION_CALLS])
        .fill(null)
        .reduce(Object.getPrototypeOf, this);

      if (prototype[HYDRATE_ON_DEMAND]) {
        this[HYDRATION_CALLS]++;
        prototype[HYDRATE_ON_DEMAND].call(this);
        this[HYDRATION_CALLS]--;
      }

      if (this.renderRoot) {
        return;
      }

      this[DEFER_HYDRATION] = false;
      this.removeAttribute('defer-hydration');
      prototype.connectedCallback.call(this);
    }

    render(): TemplateResult {
      if (!state) {
        return super.render();
      }

      return html`${when(this[state as keyof this], () => super.render())}`;
    }
  };
}
