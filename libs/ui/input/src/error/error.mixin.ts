import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Constructor } from '../../../utilities/model';
import { ErrorInterface } from './error.model';

export const ErrorMixin = <T extends Constructor<LitElement>>(
  superClass: T
): Constructor<ErrorInterface> & T => {
  class ErrorClass extends superClass {
    @property() errorMessage?: string;

    protected renderError(): TemplateResult {
      return html`
        ${when(
          this.hasError(),
          () => html` <oryx-error-message .message=${this.errorMessage}>
            <slot name="error"></slot>
          </oryx-error-message>`
        )}
      `;
    }

    protected hasError(): boolean {
      const hasError =
        !!this.errorMessage || this.querySelectorAll('[slot=error]').length > 0;
      if (hasError && !this.classList.contains('has-error')) {
        this.classList.toggle('has-error', hasError);
      }
      return hasError;
    }
  }

  return ErrorClass as unknown as Constructor<ErrorInterface> & T;
};
