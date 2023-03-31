import { AlertType, Size } from '@spryker-oryx/ui';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  CLOSE_EVENT,
  NotificationComponentAttributes,
  NotificationEvent,
  Scheme,
} from './notification.model';
import { notificationStyles } from './notification.styles';

export class NotificationComponent
  extends LitElement
  implements NotificationComponentAttributes
{
  static styles = [notificationStyles];

  @property() key?: string;
  @property({ type: String, reflect: true }) type = AlertType.Info;
  @property({ type: Boolean }) closable = false;
  @property({ type: Boolean }) floating = false;
  @property({ type: String, reflect: true }) scheme?: Scheme;
  @property() subtext?: string;
  @property({ type: Boolean }) visible = true;

  //translation
  @property() closeButtonAriaLabel = 'close the notification';

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
      <button aria-label=${this.closeButtonAriaLabel} @click=${this.onClose}>
        <oryx-icon type="close"></oryx-icon>
      </button>
    </oryx-icon-button>`;
  }

  protected onClose(): void {
    this.dispatchEvent(
      new CustomEvent<NotificationEvent>(CLOSE_EVENT, {
        detail: { key: this.key },
        composed: true,
        bubbles: true,
      })
    );
  }
}
