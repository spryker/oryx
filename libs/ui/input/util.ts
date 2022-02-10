import { LitElement } from 'lit';
import { queryFirstAssigned } from '../utilities';

export function getControl(element: LitElement): HTMLInputElement | undefined {
  return queryFirstAssigned<HTMLInputElement>(element, {
    selector: 'input, select',
    flatten: true,
  });
}
