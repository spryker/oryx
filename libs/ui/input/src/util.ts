import { queryFirstAssigned } from '../../utilities';
import { LitElement } from 'lit';

export function getControl(
  element: LitElement
): HTMLInputElement | HTMLSelectElement | undefined {
  return queryFirstAssigned<HTMLInputElement | HTMLSelectElement>(element, {
    selector: 'input, select, textarea',
    flatten: true,
  });
}
