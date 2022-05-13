import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { Direction } from '../../../utilities/model';
import {
  CheckboxListProperties,
  CheckboxListStatus,
} from './checkbox-list.model';
import { checkboxListStyles } from './checkbox-list.styles';

export class CheckboxListComponent
  extends LitElement
  implements CheckboxListProperties
{
  static styles = checkboxListStyles;

  @property({ reflect: true }) direction?: Direction;

  @property() heading?: string;

  protected getInputElements(): HTMLInputElement[] {
    const inputs = this.querySelectorAll<HTMLInputElement>(
      'oryx-checkbox > input'
    );

    return Array.from(inputs).filter(
      (element) =>
        element.parentElement?.parentElement === this &&
        !element.hasAttribute('slot')
    );
  }

  protected getGroupStatus(): CheckboxListStatus {
    const inputElements = this.getInputElements();

    const isChecked = (element: HTMLInputElement): boolean => !!element.checked;

    const checked = inputElements.every(isChecked);
    const partiallyChecked = inputElements.some(isChecked);

    if (checked) return CheckboxListStatus.checked;
    if (partiallyChecked) return CheckboxListStatus.partiallyChecked;

    return CheckboxListStatus.unchecked;
  }

  protected updateList(value: boolean): void {
    const inputElements = this.getInputElements();

    inputElements.forEach((inputElement) => {
      inputElement.checked = value;
    });
  }

  toggle(force?: boolean): void {
    if (force === undefined) {
      force = this.getGroupStatus() !== CheckboxListStatus.checked;
    }

    this.updateList(force);
  }

  protected override render(): TemplateResult {
    return html`
      <slot name="heading">${this.heading}</slot>
      <slot></slot>
    `;
  }
}
