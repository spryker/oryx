import { LitElement } from 'lit';
import { QueryAssignedElementsOptions } from 'lit/decorators.js';

export const queryAssignedElements = (
  host: LitElement,
  options: QueryAssignedElementsOptions = {}
): Element[] => {
  const { selector, slot } = options;
  const slotSelector = `slot${slot ? `[name=${slot}]` : ':not([name])'}`;
  const slotEl = host.renderRoot?.querySelector<HTMLSlotElement>(slotSelector);
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
  'a[href]',
  'button',
  '[tabindex]',
  'input',
  'select',
  'textarea',
];

/**
 * Indicates whether the given element is focusable (ie. button, select, input).
 */
export const isFocusable = (element: Element): boolean => {
  return focusableSelectors
    .map((selector) => selector.split('[')[0])
    .includes(element.tagName.toLowerCase());
};
