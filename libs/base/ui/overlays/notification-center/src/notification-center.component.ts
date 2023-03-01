import { Schemes } from '@spryker-oryx/ui/notification';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import {
  NotificationPosition,
  NotificationRegistry,
  NotificationStrategy,
} from './notification-center.model';
import { notificationCenterBaseStyles } from './notification-center.styles';
import { RegistryController } from './registry.controller';

export const defaultStrategy: NotificationStrategy = {
  scheme: Schemes.LIGHT,
  autoClose: true,
  autoCloseTime: 4000,
  closable: true,
  floating: true,
};

export class NotificationCenterComponent extends LitElement {
  static styles = [notificationCenterBaseStyles];

  @property({ reflect: true }) position?: NotificationPosition;

  @property() set maxWidth(value: string) {
    if (!value) return;
    this.style.setProperty('--oryx-notification-max-width', value);
  }

  @property() set marginBlock(value: string) {
    if (!value) return;
    this.style.setProperty('--oryx-notification-margin-block', value);
  }

  @property() set marginInline(value: string) {
    if (!value) return;
    this.style.setProperty('--oryx-notification-margin-inline', value);
  }

  protected registryController = new RegistryController(this);

  @state()
  get registry(): NotificationRegistry[] {
    return this.registryController.registry;
  }

  open(strategy: NotificationStrategy): string {
    this.registryController.registry = [
      ...this.registryController.registry,
      strategy,
    ];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.registry[this.registry.length - 1].key!;
  }

  close(key: string): void {
    this.registryController.handleNotificationClose(key);
  }

  protected renderNotification(registry: NotificationRegistry): TemplateResult {
    return html`
      <oryx-notification
        type=${ifDefined(registry.type)}
        scheme=${ifDefined(registry.scheme)}
        ?closable=${registry.closable}
        ?floating=${registry.floating}
        ?visible=${registry.visible}
        @oryx.close=${(): void =>
          this.registryController.handleNotificationClose(
            registry.key as string
          )}
        @mouseenter=${(): void =>
          this.registryController.preventAutoClose(registry.key as string)}
        @transitionend=${(): void =>
          this.registryController.handleTransitionEnd(registry.key as string)}
      >
        ${registry.content}
        ${when(
          registry.subtext,
          () => html`<span slot="subtext">${registry.subtext}</span>`
        )}
      </oryx-notification>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this.registry,
        ({ key }) => key,
        (item) => this.renderNotification(item)
      )}
    `;
  }
}
