import { PromiseSubject } from '@spryker-oryx/core/utilities';
import { Type } from '@spryker-oryx/utilities';
import {
  ComponentDefImpl,
  ComponentImplStrategy,
  ObservableShadow,
} from './components.model';

/**
 * Used for observing shadow DOM content.
 */
export function componentExtender<T extends Type<HTMLElement>>(
  componentType: T,
  name: string
): T & Type<ObservableShadow> {
  return class ObservableShadowElement
    extends componentType
    implements ObservableShadow
  {
    private _attachedShadow = new PromiseSubject<ShadowRoot>();

    get tagName(): string {
      return super.tagName ?? name.toUpperCase();
    }

    whenShadowAttached(): Promise<ShadowRoot> {
      return this._attachedShadow.asPromise();
    }

    attachShadow(
      ...args: Parameters<HTMLElement['attachShadow']>
    ): ReturnType<HTMLElement['attachShadow']> {
      const shadowRoot = super.attachShadow(...args);
      this._attachedShadow.resolve(shadowRoot);

      return shadowRoot;
    }
  };
}

export function isObservableShadowElement<T extends HTMLElement>(
  element: T
): element is T & ObservableShadow {
  return (
    typeof (element as unknown as ObservableShadow).whenShadowAttached ===
    'function'
  );
}

export class ComponentsPluginError extends Error {
  constructor(msg: string) {
    super(`ComponentsAppPlugin: ${msg}`);
  }
}

export function isComponentImplStrategy(
  impl: ComponentDefImpl
): impl is ComponentImplStrategy {
  return typeof impl === 'object';
}
