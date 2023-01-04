import { resolve } from '@spryker-oryx/di';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { NotificationService as SiteNotificationService } from '@spryker-oryx/site';
import {
  NotificationCenterComponent,
  NotificationService,
  NotificationStrategy,
} from '@spryker-oryx/ui/notification-center';
import { asyncValue, hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { filter, tap } from 'rxjs';
import { SiteNotificationCenterOptions } from './notification-center.model';

@hydratable('window:oryx-notify')
export class SiteNotificationCenterComponent extends ComponentMixin<SiteNotificationCenterOptions>() {
  protected notificationService = new NotificationService();
  protected siteNotificationService = resolve(SiteNotificationService);

  protected contentController = new ContentController(this);
  protected options$ = this.contentController.getOptions();

  protected centerRef = createRef<NotificationCenterComponent>();

  @subscribe()
  protected notification$ = this.siteNotificationService.get().pipe(
    filter(
      (
        notification: NotificationStrategy | null
      ): notification is NotificationStrategy => !!notification
    ),
    tap(async (notification) => {
      if (!(this.centerRef.value && 'open' in this.centerRef.value)) {
        await customElements.whenDefined('oryx-notification-center');
      }

      this.centerRef.value?.open?.(notification);
    })
  );

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.options$,
      (options) => html`<oryx-notification-center
        position="${options.position ?? 'top-end'}"
        ${ref(this.centerRef)}
      ></oryx-notification-center>`
    )}`;
  }
}
