import { LitElement } from 'lit';
import { QueryAssignedElementsOptions } from 'lit/decorators.js';

export const queryAssignedElements = (
  host: LitElement,
  options: QueryAssignedElementsOptions = {}
): Element[] | undefined => {
  const { selector, slot } = options;
  const slotSelector = `slot${slot ? `[name=${slot}]` : ':not([name])'}`;
  const slotEl = host.renderRoot.querySelector<HTMLSlotElement>(slotSelector);
  const elements = slotEl?.assignedElements(options);
  if (elements && selector) {
    return elements.filter((node) => node.matches(selector));
  }
  return elements;
};
