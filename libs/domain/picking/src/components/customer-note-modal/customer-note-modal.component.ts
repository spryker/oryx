import { CLOSE_EVENT } from '@spryker-oryx/ui/modal';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './customer-note-modal.styles';

export class CustomerNoteModal extends LitElement {
  static styles = styles;

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
    return html` <oryx-modal ?open=${this.note} enableFooter>
      <span slot="heading">${i18n('picking.customer-note.heading')}</span/>

      ${this.note}

      <oryx-button slot="footer" type="primary" size="small">
        <button @click=${this.close}>
          <oryx-icon type="checkMark"></oryx-icon>
          ${i18n('picking.customer-note.close')}
        </button>
      </oryx-button>
    </oryx-modal>`;
  }
}
