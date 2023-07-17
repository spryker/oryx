import { hydrate } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { Notification } from '../../notification';
import {
  NotificationCenterComponentAttributes,
  NotificationPosition,
  NotificationRegistry,
} from './notification-center.model';
import { notificationCenterBaseStyles } from './notification-center.styles';
import { RegistryController } from './registry.controller';

@hydrate()
export class NotificationCenterComponent
  extends LitElement
  implements NotificationCenterComponentAttributes
{
  static styles = [notificationCenterBaseStyles];

  protected registryController = new RegistryController(this);

  @property({ reflect: true }) position?: NotificationPosition;
  @property({ reflect: true, type: Boolean }) stackable?: boolean;

  /**
   * Opens the given notification in the notification center.
   */
  open(notification: Notification): void {
    this.registryController.add(notification);
  }

  protected override render(): TemplateResult {
    const notifications = this.registryController.getItems();
    return html`
      ${repeat(
        notifications,
        ({ key }) => key,
        (item) => this.renderNotification(item)
      )}
    `;
  }

  protected renderNotification(registry: NotificationRegistry): TemplateResult {
    return html`
      <oryx-notification
        type=${ifDefined(registry.type)}
        scheme=${ifDefined(registry.scheme)}
        .key=${registry.key}
        ?closable=${registry.closable}
        ?floating=${registry.floating}
        ?visible=${registry.visible}
      >
        ${registry.content}
        ${when(
          registry.subtext,
          () => html`<span slot="subtext">${registry.subtext}</span>`
        )}
      </oryx-notification>
    `;
  }
}
