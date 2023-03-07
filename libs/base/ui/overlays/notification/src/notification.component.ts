import { AlertType, Size } from '@spryker-oryx/ui';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CLOSE_EVENT, Schemes } from './notification.model';
import { notificationStyles } from './notification.styles';

export class NotificationComponent extends LitElement {
  static styles = [notificationStyles];

  @property({ type: String, reflect: true }) type = AlertType.Info;
  @property({ type: Boolean }) closable = false;
  @property({ type: Boolean }) floating = false;
  @property({ type: String, reflect: true }) scheme?: Schemes;
  @property() subtext?: string;

  //translation
  @property() closeButtonAriaLabel = 'close the notification';

  protected dispatchCloseEvent(): void {
    this.dispatchEvent(
      new CustomEvent(CLOSE_EVENT, {
        composed: true,
        bubbles: true,
      })
    );
  }

  protected override render(): TemplateResult {
    return html`
      ${this.renderIcon()}
      <slot></slot>
      <slot name="subtext">${this.subtext}</slot>
      ${this.renderCloseButton()}
    `;
  }

  protected renderIcon(): TemplateResult | void {
    if (!this.type) return;

    return html`<oryx-icon type=${this.type} class="illustrative"></oryx-icon>`;
  }

  protected renderCloseButton(): TemplateResult | void {
    if (!this.closable) return;

    return html`<oryx-icon-button size=${Size.Sm}>
      <button
        aria-label=${this.closeButtonAriaLabel}
        @click="${this.dispatchCloseEvent}"
      >
        <oryx-icon type="close"></oryx-icon>
      </button>
    </oryx-icon-button>`;
  }
}
