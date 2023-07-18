import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { I18nMixin, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export class CustomerNoteModalComponent extends I18nMixin(LitElement) {
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
        >
          <button @click=${this.close}>
            <oryx-icon .type=${IconTypes.Check}></oryx-icon>
            ${this.i18n('picking-lists.customer-note.got-it')}
          </button>
        </oryx-button>
      </oryx-modal>
    `;
  }
}
