import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../../error-message/src/index';

export abstract class FormControlComponent extends LitElement {
  private _error?: string;

  /**
   * A visual label for the text control.
   */
  @property() label?: string;

  /**
   * Controls the disabled visual effect of the control, based on the
   * input disabled state.
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * Returns the control (input, select, etc.) that is projected
   * in the main slot.
   */
  protected get control(): HTMLInputElement | null {
    return this.querySelector('input, select');
  }

  /**
   * You can use this to set an error messages for the control.
   *
   * When an error message is given, the control will be styled accordingly.
   */
  @property()
  set error(val: string | undefined) {
    const oldVal = this._error;
    this._error = val;
    this.requestUpdate('error', oldVal);
    if (val) {
      this.showError = true;
      this.hasError = true;
    }
  }

  get error(): string | undefined {
    return this._error;
  }

  /**
   * Indicates that the text control has an error. When you use an error
   * message or slot in custom content, you don't need to set this explicitly.
   */
  @property({ type: Boolean }) hasError?: boolean;

  /**
   * Shows error styles (red color) on the control. This happens by default
   * when you set the error message or slot in content. However, if you want
   * to see the styling without having error content, or visa versa, if you
   * want to hide the styles while having error content.
   */
  @property({
    reflect: true,
    type: Boolean,
  })
  showError?: boolean;

  /**
   * Renders a control label.
   */
  protected renderLabel(): TemplateResult {
    return this.label ? html`<label>${this.label}</label>` : html``;
  }

  /**
   * Renders error messages when there is an error message or
   * content available.
   */
  protected renderErrorMessages(): TemplateResult {
    return this.hasError
      ? html`<oryx-error-message .message=${this.error}>
          <slot name="error" @slotchange=${this.handleErrorContent}></slot>
        </oryx-error-message>`
      : html`<slot name="error" @slotchange=${this.handleErrorContent}></slot>`;
  }

  protected handleErrorContent(): void {
    const hasContent = this.querySelectorAll('[slot=error]').length > 0;
    this.hasError = hasContent;
    if ((hasContent && this.showError === undefined) || this.showError) {
      this.showError = hasContent;
    }
  }

  protected handleDisabledControl(): void {
    const handle = (): void => {
      if (this.control?.disabled || this.disabled) {
        this.disabled = (this.control as HTMLInputElement).disabled;
      }
    };
    handle();
    if (this.control) {
      this.controlAttrObserver?.disconnect();
      this.controlAttrObserver = new MutationObserver((mutations) => {
        if (mutations.find((m) => m.attributeName === 'disabled')) {
          handle();
        }
      });
      this.controlAttrObserver.observe(this.control, { attributes: true });
    }
  }

  protected controlAttrObserver?: MutationObserver;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.controlAttrObserver?.disconnect();
  }
}
