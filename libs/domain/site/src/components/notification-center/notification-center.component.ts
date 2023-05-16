import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { NotificationService } from '@spryker-oryx/site';
import {
  NotificationCenterComponent,
  NotificationPosition,
} from '@spryker-oryx/ui/notification-center';
import { hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { tap } from 'rxjs';
import { SiteNotificationCenterOptions } from './notification-center.model';

@defaultOptions({
  position: NotificationPosition.BottomStart,
  enableStacking: true,
  defaultAutoCloseTime: 8,
})
@hydratable('window:oryx-notify')
export class SiteNotificationCenterComponent extends ContentMixin<SiteNotificationCenterOptions>(
  LitElement
) {
  protected siteNotificationService = resolve(NotificationService);
  protected centerRef = createRef<NotificationCenterComponent>();

  @subscribe()
  protected notification$ = this.siteNotificationService.get().pipe(
    tap(async (notification) => {
      if (!notification) return;
      if (!(this.centerRef.value && 'open' in this.centerRef.value)) {
        await customElements.whenDefined('oryx-notification-center');
      }
      if (this.componentOptions?.autoCloseTime) {
        notification.autoCloseTime ??=
          this.componentOptions.autoCloseTime * 1000;
      }
      this.centerRef.value?.open(notification);
    })
  );

  protected override render(): TemplateResult {
    const { position, enableStacking } = this.componentOptions ?? {};

    return html`<oryx-notification-center
      .position=${position}
      ${ref(this.centerRef)}
      ?stackable=${enableStacking}
    ></oryx-notification-center>`;
  }
}
