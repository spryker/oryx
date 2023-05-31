import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export class CustomerNoteModalComponent extends LitElement {
  @property() note?: string;

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
      <oryx-modal
        ?open=${this.note}
        enableFooter
        footerButtonFullWidth
        @oryx.close=${this.close}
      >
        <oryx-heading slot="heading">
          <h2>${i18n('picking-lists.customer-note.customer-note')}</h2>
        </oryx-heading>
        ${this.note}
        <oryx-button slot="footer" type=${ButtonType.Primary} size=${Size.Md}>
          <button @click=${this.close}>
            <oryx-icon .type=${IconTypes.Mark}></oryx-icon>
            ${i18n('picking-lists.customer-note.got-it')}
          </button>
        </oryx-button>
      </oryx-modal>
    `;
  }
}
