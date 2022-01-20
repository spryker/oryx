import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export abstract class FormControlComponent extends LitElement {
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
   * Renders a control label.
   */
  protected renderLabel(): TemplateResult {
    return this.label ? html`<label>${this.label}</label>` : html``;
  }
}
