import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';

export class ErrorController implements ReactiveController {
  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  hostConnected?(): void;

  render(message?: string): TemplateResult {
    return html`
      ${when(
        this.hasError(message),
        () => html` <oryx-error-message .message=${message}>
          <slot name="error"></slot>
        </oryx-error-message>`
      )}
    `;
  }

  protected hasError(message?: string): boolean {
    const hasError =
      !!message || this.host.querySelectorAll('[slot=error]').length > 0;
    this.host.classList.toggle('has-error', hasError);
    return hasError;
  }
}
