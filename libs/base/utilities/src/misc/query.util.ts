import { LitElement } from 'lit';
import { QueryAssignedElementsOptions } from 'lit/decorators.js';

export const queryAssignedElements = (
  host: LitElement,
  options: QueryAssignedElementsOptions = {}
): Element[] => {
  const { selector, slot } = options;
  const slotSelector = `slot${slot ? `[name=${slot}]` : ':not([name])'}`;
  const slotEl = (
    host.renderRoot ?? host.shadowRoot
  )?.querySelector<HTMLSlotElement>(slotSelector);
  const elements = slotEl?.assignedElements(options);
  if (selector && elements) {
    return elements.filter((node) => node.matches(selector));
  }

  return elements ?? [];
};

export const queryFirstAssigned = <T>(
  host: LitElement,
  options: QueryAssignedElementsOptions = {}
): T | undefined => {
  const elements = queryAssignedElements(host, options);
  return elements.length > 0 ? (elements[0] as unknown as T) : undefined;
};

const focusableSelectors = [
  '[tabindex]',
  '[focusable]',
  'a',
  'button',
  'input',
  'select',
  'textarea',
];

/**
 * Indicates whether the given element is focusable (ie. button, select, input).
 * Add `focusable` attribute to make element focusable
 * Add `focusable="false"` attribute to make element not focusable
 */
export const isFocusable = (element: Element): boolean => {
  const elementAttrsValue = Array.from(element.attributes)
    .filter((attr) => focusableSelectors.includes(`[${attr.name}]`))
    .map((attr) => attr.value);

  if (elementAttrsValue.length) {
    return !elementAttrsValue.includes('false');
  }

  return focusableSelectors.includes(element.tagName.toLowerCase());
};

export const queryFirstFocusable = (
  parent: HTMLElement | LitElement
): HTMLElement | null => {
  return (
    parent instanceof LitElement && parent.shadowRoot
      ? parent.shadowRoot
      : parent
  ).querySelector(focusableSelectors.join(', '));
};
