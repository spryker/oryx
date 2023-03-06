import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './customer-note-modal.styles';

export class CustomerNoteModal extends LitElement {
  static styles = styles;

  @property() customerNote?: string;

  protected closeCustomerNoteModal(): void {
    this.dispatchEvent(new CustomEvent('close'));
  }

  protected override render(): TemplateResult {
    return html` <oryx-modal
      ?open=${this.customerNote}
      enableFooter
      @oryx.close=${this.closeCustomerNoteModal}
    >
      <span slot="heading">Customer note</span>

      ${this.customerNote}

      <oryx-button slot="footer" type="primary" size="small">
        <button @click=${this.closeCustomerNoteModal}>
          <oryx-icon type="checkMark"></oryx-icon>
          Got it
        </button>
      </oryx-button>
    </oryx-modal>`;
  }
}
