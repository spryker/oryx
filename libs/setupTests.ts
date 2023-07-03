import { getShadowElementBySelector } from '@/tools/testing';
import { fixtureCleanup } from '@open-wc/testing-helpers';
import { LitElement } from 'lit';

const { getComputedStyle } = window;

window.getComputedStyle = (elt): CSSStyleDeclaration => getComputedStyle(elt);

const querySlottedElements = (
  type: keyof HTMLElementTagNameMap,
  component: LitElement,
  slotName: string
): Element | null | undefined => {
  let selector = 'slot';

  if (slotName) {
    selector = `${selector}[name"${slotName}"]`;
  }

  return component.renderRoot
    .querySelector<HTMLSlotElement>(selector)
    ?.assignedElements({ flatten: true })
    .find((el) => el.tagName.toLowerCase() === type.toLowerCase());
};

beforeAll(() => {
  expect.extend({
    toBeInTheDocument: (selector: string) => {
      if (!document.querySelector(selector)) {
        return {
          message: (): string =>
            `Expected element to be in DOM but it was not.`,
          pass: false,
        };
      }

      return {
        message: (): string => `Element properly rendered`,
        pass: true,
      };
    },
    toContainElement: (
      component: LitElement | HTMLElement,
      selector: string
    ) => {
      const pass =
        (component instanceof LitElement &&
          !!getShadowElementBySelector(component, selector)) ||
        (component instanceof HTMLElement &&
          !!component.querySelector(selector));

      return {
        message: (): string =>
          pass
            ? 'Element properly rendered'
            : 'Expected element to be in DOM but it was not.',
        pass,
      };
    },
    toContainSlottedElement: (
      component: LitElement,
      type: keyof HTMLElementTagNameMap,
      slotName = ''
    ) => {
      if (!querySlottedElements(type, component, slotName)) {
        return {
          message: (): string =>
            `Expected element to be slotted but it was not.`,
          pass: false,
        };
      }

      return {
        message: (): string => `Element properly slotted`,
        pass: true,
      };
    },
  });
});

afterEach(() => {
  fixtureCleanup();
});

export interface CustomMatchers<R = unknown> {
  toContainElement(selector: string): R;
  toContainSlottedElement(selector: string, slotName?: string): R;
  toBeInTheDocument(): R;
}

/* eslint-disable */
declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }

  namespace jest {
    interface Matchers<R, T = {}> extends CustomMatchers<R> {}
  }

  // TODO: remove when es2023 lib for ts will be released https://github.com/microsoft/TypeScript/issues/48829
  interface Array<T> {
    findLast(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): T | undefined;
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number;
  }
}

// TODO: Remove custom mock of PromiseRejectionEvent once it's added by jsdom
// See https://github.com/jsdom/jsdom/issues/2401
window.PromiseRejectionEvent = class PromiseRejectionEvent extends Event {
  constructor(type: string, options: PromiseRejectionEventInit) {
    super(type, options);

    Object.defineProperty(this, 'promise', {
      value: options.promise,
      enumerable: true,
    });

    Object.defineProperty(this, 'reason', {
      value: options.reason,
      enumerable: true,
    });
  }
} as any;
