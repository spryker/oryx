import { hydrate, I18nMixin } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import {
  Notification,
  NotificationCenterComponentAttributes,
  NotificationContent,
  NotificationPosition,
  NotificationRegistry,
  NotificationResolvedContent,
} from './notification-center.model';
import { notificationCenterBaseStyles } from './notification-center.styles';
import { RegistryController } from './registry.controller';

@hydrate()
export class NotificationCenterComponent
  extends I18nMixin(LitElement)
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

  protected resolveContent(
    content?: NotificationContent
  ): NotificationResolvedContent | void {
    if (typeof content === 'object' && 'token' in content) {
      return this.i18n(content.token, content.context);
    }

    return content;
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
        ${this.resolveContent(registry.content)}
        ${when(
          registry.subtext,
          () =>
            html`<span slot="subtext"
              >${this.resolveContent(registry.subtext)}</span
            >`
        )}
      </oryx-notification>
    `;
  }
}
