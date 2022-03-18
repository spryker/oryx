import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { EventsController } from './events.controller';
import { Schemes, Types } from './notification.model';
import { notificationStyles } from './notification.styles';

export const TAG_NAME = 'oryx-notification';

export class NotificationComponent extends LitElement {
  static styles = [notificationStyles];

  @property({ type: String, reflect: true }) type: Types = Types.INFO;
  @property({ type: Boolean }) closable = false;
  @property({ type: Boolean }) floating = false;
  @property({ type: String, reflect: true }) scheme: Schemes = Schemes.LIGHT;

  //translation
  @property() closeButtonAriaLabel = 'close the notification';

  protected eventsController = new EventsController(this);

  render(): TemplateResult {
    return html`
      <oryx-icon .type="${this.type}"></oryx-icon>
      <slot></slot>
      ${when(
        this.closable,
        () => html`
          <button
            aria-label=${this.closeButtonAriaLabel}
            @click="${(): void => this.eventsController.dispatchCloseEvent()}"
          >
            <oryx-icon type="close" size="small"></oryx-icon>
          </button>
        `
      )}
    `;
  }
}
