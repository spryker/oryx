import type { PropertyValues } from '@lit/reactive-element';
import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/di';
import { isServer, LitElement, render, TemplateResult } from 'lit';
import { Effect, effect, resolvingSignals } from '../../signals';
import { digestForTemplateValues } from './digest-for-template';

const DEFER_HYDRATION = Symbol('deferHydration');
export const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
export const hydratableAttribute = 'hydratable';
export const deferHydrationAttribute = 'defer-hydration';

// TODO: workaround for value mismatch issue
// may not be needed in the future
// for more info check: https://github.com/lit/lit/issues/3962
export const hydrationValuesAttribute = 'hydration-values';

const SIGNAL_EFFECT = Symbol('signalEffect');

// flag to enable hydration debugging
// should be always set to false in production, to eliminate dead code
const HYDRATION_DEBUG = true;

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
     * 0/undefined - hydrated (hydration complete)
     *
     * We do use explicit 0 as an intermediate marker to facilitate
     * workaround checking hydration value mismatch
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
          const result = super.render();
          const digest = digestForTemplateValues(result);
          if (digest) this.setAttribute(hydrationValuesAttribute, digest);
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
        // delete this[DEFER_HYDRATION];
        // This is part of the workaround for hydration mismatch, we would not need this property otherwise
        this[DEFER_HYDRATION] = 0;

        if (HYDRATION_DEBUG) {
          this['__hydration-status'] = 'blue';
        }

        try {
          super.update(changedProperties);
        } catch (e) {
          // catch hydration error and recover by clearing and re-rendering
          // may become obsolete in future versions of lit

          if (HYDRATION_DEBUG) {
            this['__hydration-status'] = 'red';
          }

          this.renderRoot.innerHTML =
            this.renderRoot.innerHTML.split('<!--lit-part ')[0];
          render(this.render(), this.renderRoot, this.renderOptions);
        }
      } else {
        super.update(changedProperties);
      }
    }

    async [HYDRATE_ON_DEMAND]() {
      if (this[DEFER_HYDRATION] !== 3) return;

      this.removeAttribute(hydratableAttribute);

      this[DEFER_HYDRATION] = 2; // pre-hydrating

      let resolve: () => void | undefined;
      const promise = new Promise<void>(function (res) {
        resolve = res;
      });

      this[SIGNAL_EFFECT] = effect(() => {
        const hasResolving = resolvingSignals();
        super.render();

        if (!hasResolving()) {
          this[DEFER_HYDRATION] = 1; // hydrating
          super.connectedCallback();
          this.removeAttribute(deferHydrationAttribute);
          resolve();
        }
      });

      return promise;
    }

    render(): TemplateResult | void {
      const result = super.render();

      if (this[SIGNAL_EFFECT]) {
        this[SIGNAL_EFFECT]!.stop();
        delete this[SIGNAL_EFFECT];
      }

      if (this[DEFER_HYDRATION] === 0) {
        // workaround for checking hydration value mismatch
        delete this[DEFER_HYDRATION];
        const digestFromAttribute = this.getAttribute(hydrationValuesAttribute);
        if (digestFromAttribute) {
          const digest = digestForTemplateValues(result);
          // Returning undefined will be catched by lit as template mismatch
          if (digest !== digestFromAttribute) return;
        }
      }

      if (HYDRATION_DEBUG) {
        if (!isServer) {
          this.style.outline = `2px solid ${
            this['__hydration-status'] ?? 'green'
          }`;
          this.style.outlineOffset = '-1px';
        }
      }

      return result;
    }
  };
}
