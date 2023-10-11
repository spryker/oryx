import { ButtonColor, ButtonSize } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { I18nMixin } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';

export class PickingCustomerNoteModalComponent extends I18nMixin(LitElement) {
  @property({ type: Boolean }) open?: boolean;

  protected close(): void {
    this.dispatchEvent(
      new CustomEvent(CLOSE_EVENT, {
        bubbles: true,
        composed: true,
      })
    );
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-modal ?open=${this.open} enableFooter footerButtonFullWidth minimal>
        <oryx-heading slot="heading">
          <h2>${this.i18n('picking-lists.customer-note.customer-note')}</h2>
        </oryx-heading>
        <slot></slot>
        <oryx-button
          slot="footer"
          .color=${ButtonColor.Primary}
          .size=${ButtonSize.Md}
          .icon=${IconTypes.Check}
          .text=${this.i18n('picking-lists.customer-note.got-it')}
          @click=${this.close}
        ></oryx-button>
      </oryx-modal>
    `;
  }
}
