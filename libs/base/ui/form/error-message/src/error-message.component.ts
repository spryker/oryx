import { hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { errorStyles } from './error-message.styles';

@hydratable()
export class ErrorMessageComponent extends LitElement {
  static styles = [errorStyles];

  @property() message?: string;

  render(): TemplateResult {
    return html`
      ${this.message
        ? html`<oryx-icon type="warning"></oryx-icon> ${this.message}`
        : html`<slot></slot>`}
    `;
  }
}
