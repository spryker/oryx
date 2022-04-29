import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ErrorController, ErrorOptions, errorStyles } from '../../../input';
import { Direction } from '../../../utilities';
import { styles } from './radio-list.styles';

export class RadioListComponent extends LitElement implements ErrorOptions {
  static styles = [styles, errorStyles];

  protected errorController = new ErrorController(this);

  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;
  @property({ reflect: true }) direction?: Direction;
  @property() heading?: string;

  protected updated(): void {
    this.handleHeading();
    this.handleError();
  }

  protected handleHeading(): void {
    const hasHeading = !!this.heading || this.headingSlot.length > 0;
    this.shadowRoot
      ?.querySelector('legend')
      ?.toggleAttribute('hasHeading', hasHeading);
  }

  protected handleError(): void {
    const hasError = !!this.errorMessage || !!this.hasError;
    this.querySelectorAll('oryx-radio')?.forEach((el) =>
      el.toggleAttribute('hasError', hasError)
    );
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
