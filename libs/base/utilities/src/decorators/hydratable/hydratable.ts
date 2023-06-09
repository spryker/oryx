import type { PropertyValues } from '@lit/reactive-element';
import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/di';
import { isServer, LitElement, render, TemplateResult } from 'lit';
import { Effect, effect, resolvingSignals } from '../../signals';

const DEFER_HYDRATION = Symbol('deferHydration');
export const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
export const hydratableAttribute = 'hydratable';
export const deferHydrationAttribute = 'defer-hydration';
const SIGNAL_EFFECT = Symbol('signalEffect');

export interface HydratableLitElement extends LitElement {
  [HYDRATE_ON_DEMAND](force?: boolean): void;
}

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
    finisher(clazz: Constructor<HydratableLitElement>) {
      return hydratableClass(clazz, prop);
    },
  };
};

function hydratableClass<T extends Type<HTMLElement>>(
  target: T,
  mode?: string | string[]
): any {
  return class extends (target as any) {
    /**
     * Internal flag determining hydration state:
     * 3 - not yet hydrated (hydration deferred)
     * 2 - pre-hydrating (waiting for data required for hydration)
     * 1 - hydrating (lit hydration in progress)
     * 0 - hydrated (hydration complete)
     */
    [DEFER_HYDRATION]?: number;
    private [SIGNAL_EFFECT]?: Effect;

    constructor(...args: any[]) {
      super(...args);

      if (isServer) {
        this.setAttribute(hydratableAttribute, mode ?? '');
      } else if (this.shadowRoot) {
        this[DEFER_HYDRATION] = 3;
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
      if (this[DEFER_HYDRATION] && this[DEFER_HYDRATION] > 1) return;

      // special case for hydration
      if (this[DEFER_HYDRATION] === 1) {
        delete this[DEFER_HYDRATION];
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
      if (this[DEFER_HYDRATION] !== 3) return;

      // if (this[DEFER_HYDRATION] === 3) {
      //   this[DEFER_HYDRATION] = 1; // hydrating
      //   super.connectedCallback();
      //   this.removeAttribute(deferHydrationAttribute);
      //   return;
      // }

      // TODO: here we will need to resolve all data needed for hydration
      this[DEFER_HYDRATION] = 2; // pre-hydrating

      console.log('starting effect', this.tagName);

      this[SIGNAL_EFFECT] = effect(() => {
        console.log('render pass', this.tagName);
        const hasResolving = resolvingSignals();
        super.render();

        if (!hasResolving()) {
          console.log('hydration', this.tagName);
          this[DEFER_HYDRATION] = 1; // hydrating
          super.connectedCallback();
          this.removeAttribute(deferHydrationAttribute);
        }
      });

      // setTimeout(() => {
      //   console.log('hydration', this.tagName);
      //   this[DEFER_HYDRATION] = 1; // hydrating
      //   super.connectedCallback();
      //   this.removeAttribute(deferHydrationAttribute);
      // }, 3000);
    }

    render(): TemplateResult {
      const result = super.render();
      // setTimeout(() => {
      //   console.log('stopping effect', this.tagName);
      if (this[SIGNAL_EFFECT]) {
        this[SIGNAL_EFFECT]!.stop();
        delete this[SIGNAL_EFFECT];
      }
      // }, 3000);
      return result;
    }
  };
}
