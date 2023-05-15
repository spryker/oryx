import type { PropertyValues } from '@lit/reactive-element';
import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/di';
import { isServer, LitElement, noChange, render, TemplateResult } from 'lit';
import { Effect, effect } from '../../signals';

const DEFER_HYDRATION = Symbol('deferHydration');
export const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
export const hydratableAttribute = 'hydratable';
export const deferHydrationAttribute = 'defer-hydration';
const SIGNAL_EFFECT = Symbol('signalEffect');

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
    [DEFER_HYDRATION]?: number;
    private [SIGNAL_EFFECT]?: Effect;

    constructor(...args: any[]) {
      super(...args);

      if (isServer) {
        this.setAttribute(hydratableAttribute, mode ?? '');
      } else if (this.shadowRoot) {
        this[DEFER_HYDRATION] = 1;
      }
    }

    willUpdate(_changedProperties: PropertyValues): void {
      super.willUpdate(_changedProperties);
      if (isServer) {
        // we trigger SSR awaiter on the server, to resolve all asynchronous logic before rendering
        this[SIGNAL_EFFECT] = effect(() => {
          super.render();
        });
      }
    }

    connectedCallback() {
      if (this[DEFER_HYDRATION]) return;
      super.connectedCallback();
    }

    update(changedProperties: PropertyValues) {
      if (this[DEFER_HYDRATION]) return;

      // special case for hydration
      if (this._$needsHydration) {
        try {
          super.update(changedProperties);
        } catch (e) {
          // catch hydration error and recover by clearing and re-rendering
          // may become obsolete in future versions of lit
          this.renderRoot.innerHTML =
            this.renderRoot.innerHTML.split('<!--lit-part ')[0];
          render(this.render(), this.renderRoot, this.renderOptions);
        }
      } else {
        super.update(changedProperties);
      }
    }

    [HYDRATE_ON_DEMAND]() {
      if (this[DEFER_HYDRATION] !== 1) return;
      this[DEFER_HYDRATION] = 2; // hydrating

      // this[SIGNAL_EFFECT] = effect(() => {
      //   super.render();
      // });

      delete this[DEFER_HYDRATION];
      super.connectedCallback();
      this.removeAttribute(deferHydrationAttribute);
      // setTimeout(() => {
      //   delete this[DEFER_HYDRATION];
      //   // we have to call connectedCallback manually, as lit hydration will only call LitElement part
      //   super.connectedCallback();
      //   this.removeAttribute(deferHydrationAttribute);
      // }, 0);
    }

    render(): TemplateResult {
      const result = super.render();
      if (this[SIGNAL_EFFECT]) {
        this[SIGNAL_EFFECT]!.stop();
        delete this[SIGNAL_EFFECT];
      }
      return result;
    }
  };
}
