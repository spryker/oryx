import { html, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { OryxElement } from '../../../utilities';
import { ErrorOptions } from './error.model';

export class ErrorController implements ReactiveController {
  hostConnected?(): void;

  render(): TemplateResult {
    return html`
      ${when(
        this.hasError(),
        () => html` <oryx-error-message .message=${this.message}>
          <slot name="error"></slot>
        </oryx-error-message>`
      )}
    `;
  }

  protected hasError(): boolean {
    const hasError =
      !!this.message || this.host.querySelectorAll('[slot=error]').length > 0;
    if (hasError && !this.host.classList.contains('has-error')) {
      this.host.classList.toggle('has-error', hasError);
    }
    return hasError;
  }

  protected get message(): string | undefined {
    return this.host.options.errorMessage;
  }

  constructor(protected host: OryxElement<ErrorOptions>) {
    this.host.addController(this);
  }
}
