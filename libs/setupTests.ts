import { fixtureCleanup } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { LitElement } from 'lit';
import fetch from 'node-fetch';
const { getComputedStyle } = window;

window.getComputedStyle = (elt): CSSStyleDeclaration => getComputedStyle(elt);
window.fetch = fetch as any;

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
    toContainElement: (component: LitElement, selector: string) => {
      if (!getShadowElementBySelector(component, selector)) {
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
}
