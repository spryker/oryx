import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { ErrorOptions } from './error.model';

export class ErrorController implements ReactiveController {
  hostUpdated?(): void {
    this.handleError();
  }

  render(): TemplateResult {
    return html`<oryx-error-message .message=${this.message}>
      <slot name="error" @slotchange=${this.handleError.bind(this)}></slot>
    </oryx-error-message>`;
  }

  protected handleError(): void {
    const hasErrorContent = !!this.message || this.errorSlot.length > 0;
    const errorMessage = (this.host.shadowRoot as ShadowRoot).querySelector(
      'oryx-error-message'
    );
    const hasErrorContentAttr = errorMessage?.hasAttribute('hasErrorContent');

    errorMessage?.toggleAttribute('hasErrorContent', hasErrorContent);
    if (!this.host.hasAttribute('hasError') || hasErrorContentAttr)
      this.host.toggleAttribute('hasError', hasErrorContent);
  }

  protected get message(): string | undefined {
    return this.host.errorMessage;
  }

  protected get errorSlot(): NodeListOf<Element> {
    return this.host.querySelectorAll('[slot=error]');
  }

  constructor(protected host: ErrorOptions & LitElement) {
    this.host.addController(this);
  }
}
