import { IconTypes } from '@spryker-oryx/ui/icon';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { errorStyles } from './error-message.styles';

export class ErrorMessageComponent extends LitElement {
  static styles = [errorStyles];

  @property() message?: string;

  render(): TemplateResult {
    return html`
      ${this.message
        ? html`<oryx-icon .type=${IconTypes.Warning} part="icon"></oryx-icon>
            ${this.message}`
        : html`<slot></slot>`}
    `;
  }
}
