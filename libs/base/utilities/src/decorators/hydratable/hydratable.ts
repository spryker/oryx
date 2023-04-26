import type { PropertyValues } from '@lit/reactive-element';
import {
  ClassDescriptor,
  Constructor,
} from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/di';
import { html, isServer, LitElement, noChange, TemplateResult } from 'lit';
import { Effect, effect, resolvingSignals } from '../../signals';
import { asyncStates } from '../async-state';

const DEFER_HYDRATION = Symbol('deferHydration');
const HYDRATION_CALLS = Symbol('hydrationCalls');
export const HYDRATE_ON_DEMAND = '$__HYDRATE_ON_DEMAND';
export const HYDRATING = '$__HYDRATING';
export const hydratableAttribute = 'hydratable';
export const deferHydrationAttribute = 'defer-hydration';
export const hydrationRender = Symbol('hydrationRender');
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
    static properties = {
      [hydrationRender]: { type: Boolean, state: true },
    };

    [DEFER_HYDRATION] = false;
    private [hydrationRender] = true;
    private hasSsr?: boolean;
    private [HYDRATION_CALLS] = 0;

    private [SIGNAL_EFFECT]?: Effect;

    constructor(...args: any[]) {
      super(...args);

      this.hasSsr = !isServer && !!this.shadowRoot;

      if (isServer) {
        this.setAttribute(hydratableAttribute, mode ?? '');
      }

      if (this.hasSsr) {
        this[DEFER_HYDRATION] = true;
        this[hydrationRender] = false;
      }
    }

    willUpdate(_changedProperties: PropertyValues): void {
      super.willUpdate(_changedProperties);
      if (isServer) {
        this[SIGNAL_EFFECT] = effect(() => {
          super.render();
        });
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
        this[hydrationRender] = false;
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

    protected signalResolver() {
      if (isServer) {
        this[SIGNAL_EFFECT]?.stop();
        return;
      }

      effect((effect) => {
        const hasResolving = resolvingSignals();
        super.render();
        if (hasResolving()) {
          this[hydrationRender] = false;
          effect.stop();
        } else {
          this[hydrationRender] = true;
        }
      });
    }

    render(): TemplateResult {
      this.signalResolver();

      const states = this[asyncStates];

      if (this.hasSsr && !this[hydrationRender]) {
        setTimeout(() => {
          this[hydrationRender] = true;
        }, 0);
      }

      if (this.hasSsr && states) {
        return html`${whenState(
          Object.values(states).every(Boolean) && this[hydrationRender],
          () => super.render()
        )}`;
      }

      return this.hasSsr || isServer
        ? html`${whenState(this[hydrationRender], () => super.render())}`
        : super.render();
    }
  };
}
