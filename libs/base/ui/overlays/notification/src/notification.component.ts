import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { CLOSE_EVENT, Schemes, Types } from './notification.model';
import { notificationBaseStyles, notificationStyles } from './styles';

export class NotificationComponent extends LitElement {
  static styles = [notificationBaseStyles, notificationStyles];

  @property({ type: String, reflect: true }) type?: Types;
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
      <slot></slot>
      <slot name="subtext">${this.subtext}</slot>
      ${when(
        this.closable,
        () => html`
          <oryx-icon-button size="sm">
            <button
              aria-label=${this.closeButtonAriaLabel}
              @click="${(): void => this.dispatchCloseEvent()}"
            >
              <oryx-icon type="close"></oryx-icon>
            </button>
          </oryx-icon-button>
        `
      )}
    `;
  }
}
