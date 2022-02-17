import { LitElement } from 'lit';
import { queryFirstAssigned } from '../../utilities';

export function getControl(
  element: LitElement
): HTMLInputElement | HTMLSelectElement | undefined {
  return queryFirstAssigned<HTMLInputElement>(element, {
    selector: 'input, select, textarea',
    flatten: true,
  });
}
