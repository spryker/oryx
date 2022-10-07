import { PromiseSubject } from '@spryker-oryx/core/utilities';
import { Type } from '@spryker-oryx/utilities';

export interface ObservableShadow {
  whenShadowAttached(): Promise<ShadowRoot>;
}

export interface ObservableShadowElement
  extends HTMLElement,
    ObservableShadow {}

/**
 * Used for observing shadow DOM content.
 */
export function observableShadow<T extends Type<HTMLElement>>(
  componentType: T
): T & Type<ObservableShadow> {
  return class ObservableShadowElement
    extends componentType
    implements ObservableShadow
  {
    private _attachedShadow = new PromiseSubject<ShadowRoot>();

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
