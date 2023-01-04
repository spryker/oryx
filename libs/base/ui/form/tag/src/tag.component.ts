import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { tagStyles } from './tag.styles';

export const CLOSE_EVENT = 'oryx.close';

export class TagComponent extends LitElement {
  static styles = [tagStyles];

  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  //translation
  @property() removeButtonAriaLabel = 'Remove tag';

  protected override render(): TemplateResult {
    return html`
      <slot></slot>
      <button
        ?disabled=${this.disabled}
        aria-label=${this.removeButtonAriaLabel}
      >
        <oryx-icon type="close"></oryx-icon>
      </button>
    `;
  }
}
