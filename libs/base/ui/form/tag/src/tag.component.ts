import { IconTypes } from '@spryker-oryx/ui/icon';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { tagStyles } from './tag.styles';

/**
 * @deprecated since 1.4.
 */
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
        <oryx-icon .type=${IconTypes.Close}></oryx-icon>
      </button>
    `;
  }
}
