import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ErrorController, ErrorOptions, errorStyles } from '../../input';
import { baseStyles } from './radio.styles';

export class RadioComponent extends LitElement implements ErrorOptions {
  static styles = [baseStyles, errorStyles];

  protected errorController = new ErrorController(this);

  @property() errorMessage?: string;
  @property({ type: Boolean }) hasError?: boolean;

  protected render(): TemplateResult {
    return html`
      <label>
        <slot></slot>
        <slot name="subtext"></slot>
      </label>
      ${this.errorController.render()}
    `;
  }
}
