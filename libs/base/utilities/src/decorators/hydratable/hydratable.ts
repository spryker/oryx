import type { PropertyValues } from '@lit/reactive-element';
import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/di';
import { html, isServer, LitElement, noChange, TemplateResult } from 'lit';
import { asyncStates } from '../async-state';

const DEFER_HYDRATION = Symbol('deferHydration');
const HYDRATION_CALLS = Symbol('hydrationCalls');
export const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
export const HYDRATING = '$__HYDRATING';
export const hydratableAttribute = 'hydratable';
export const deferHydrationAttribute = 'defer-hydration';
export const hydrationRerender = Symbol('hydrationRerender');

interface PatchableLitElement extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-new
  new (...args: any[]): PatchableLitElement;
  _$needsHydration?: boolean;
}

export interface HydratableLitElement extends LitElement {
  [HYDRATE_ON_DEMAND](force?: boolean): void;
}

const whenState = (condition: unknown, trueCase: () => TemplateResult) =>
  condition ? trueCase() : noChange;

export const hydratable =
  (prop?: string | string[]) =>
  (classOrDescriptor: Type<HTMLElement> | ClassDescriptor): void =>
    typeof classOrDescriptor === 'function'
      ? legacyCustomElement(classOrDescriptor, prop)
      : standardCustomElement(classOrDescriptor as ClassDescriptor, prop);

const legacyCustomElement = (
  clazz: Type<HTMLElement>,
  prop?: string | string[]
) => {
  return hydratableClass(clazz, prop);
};

const standardCustomElement = (
  descriptor: ClassDescriptor,
  prop?: string | string[]
) => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    finisher(clazz: Constructor<PatchableLitElement>) {
      return hydratableClass(clazz, prop);
    },
  };
};

function hydratableClass<T extends Type<HTMLElement>>(
  target: T,
  mode?: string | string[]
): any {
  return class extends (target as any) {
    static properties = {
      [hydrationRerender]: { type: Boolean, state: true },
    };

    [DEFER_HYDRATION] = false;
    [hydrationRerender] = true;
    private hasSsr?: boolean;
    private [HYDRATION_CALLS] = 0;

    constructor(...args: any[]) {
      super(...args);
      this.hasSsr = !isServer && !!this.shadowRoot;

      if (isServer) {
        this.setAttribute(hydratableAttribute, mode ?? '');
      }

      if (this.hasSsr) {
        this[DEFER_HYDRATION] = true;
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

    [HYDRATE_ON_DEMAND](skipMissMatch?: boolean) {
      if (skipMissMatch) {
        this.useRealRender = false;
      }

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
      this.removeAttribute(deferHydrationAttribute);
      prototype.connectedCallback.call(this);
    }

    render(): TemplateResult {
      const states = this[asyncStates];

      setTimeout(() => {
        if (!this[hydrationRerender]) this[hydrationRerender] = true;
      }, 0);

      if (this.hasSsr && states) {
        return html`${whenState(
          Object.values(states).every(Boolean) && this[hydrationRerender],
          () => super.render()
        )}`;
      }

      return this.hasSsr || isServer
        ? html`${whenState(this[hydrationRerender], () => super.render())}`
        : super.render();
    }
  };
}
