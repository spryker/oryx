import { html, LitElement, TemplateResult } from 'lit';
import { confirmationBaseStyles } from './confirmation.styles';

export class CartEntryConfirmationComponent extends LitElement {
  static styles = confirmationBaseStyles;

  protected onRemove(): void {
    this.dispatchEvent(new CustomEvent('remove'));
  }

  protected onCancel(): void {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  protected render(): TemplateResult {
    return html`
      <oryx-notification
        type="warning"
        scheme="dark"
        closable
        @oryx.close=${this.onCancel}
      >
        <span>Do you want to delete the product(s)?</span>

        <oryx-button type="text">
          <button @click=${this.onRemove}>Delete product(s)</button>
        </oryx-button>

        <oryx-button type="text">
          <button @click=${this.onCancel}>Cancel</button>
        </oryx-button>
      </oryx-notification>
    `;
  }
}
