import { Direction } from '@spryker-oryx/ui';
import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import { ErrorController, errorStyles } from '../../input';
import { InputListProperties, InputListStatus } from './input-list.model';
import { styles } from './input-list.styles';

export class InputListComponent
  extends LitElement
  implements InputListProperties
{
  static styles = [styles, errorStyles];

  protected errorController = new ErrorController(this);

  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property({ reflect: true }) direction?: Direction;
  @property() heading?: string;

  @queryAssignedElements() protected childElements!: Array<HTMLElement>;

  protected updated(): void {
    this.handleHeading();
    this.handleError();
  }

  protected handleHeading(): void {
    const hasHeading = !!this.heading || !!this.headingSlot.length;
    this.shadowRoot
      ?.querySelector('legend')
      ?.toggleAttribute('hasHeading', hasHeading);
  }

  protected handleError(): void {
    const hasError = !!this.errorMessage || !!this.hasError;

    Array.from(this.childElements).forEach((child) => {
      child.toggleAttribute('hasError', hasError);
    });
  }

  getInputElements(): HTMLInputElement[] {
    const inputs = this.querySelectorAll<HTMLInputElement>(
      '* > input:not([slot])'
    );

    return [...inputs].filter(
      (element) => element.parentElement?.parentElement === this
    );
  }

  protected getGroupStatus(): InputListStatus {
    const inputElements = this.getInputElements();

    const isChecked = (element: HTMLInputElement): boolean => !!element.checked;

    let checked = true;
    let partiallyChecked = false;

    inputElements.forEach((input) => {
      if (isChecked(input)) partiallyChecked = true;
      else checked = false;
    });

    if (checked) return InputListStatus.checked;
    if (partiallyChecked) return InputListStatus.partiallyChecked;

    return InputListStatus.unchecked;
  }

  protected updateList(value: boolean): void {
    const inputElements = this.getInputElements();

    inputElements.forEach((inputElement) => {
      inputElement.checked = value;
      inputElement.dispatchEvent(
        new InputEvent('input', { bubbles: true, composed: true })
      );
    });
  }

  toggle(force?: boolean): void {
    if (force === undefined) {
      force = this.getGroupStatus() !== InputListStatus.checked;
    }
    this.updateList(force);
  }

  protected get headingSlot(): NodeListOf<Element> {
    return this.querySelectorAll('[slot=heading]');
  }

  protected render(): TemplateResult {
    return html`
      <fieldset>
        <legend>
          <slot name="heading" @slotchange=${this.handleHeading.bind(this)}>
            ${this.heading}
          </slot>
        </legend>
        <slot class="content"></slot>
      </fieldset>
      ${this.errorController.render()}
    `;
  }
}
