import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  NotificationCenterComponent,
  NotificationPosition,
} from '@spryker-oryx/ui/notification-center';
import {computed, effect, hydratable, signal, subscribe} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { tap } from 'rxjs';
import { NotificationService } from '../../services';
import { SiteNotificationCenterOptions } from './notification-center.model';

@defaultOptions({
  position: NotificationPosition.BottomStart,
  enableStacking: true,
  autoCloseTime: 8,
})
@hydratable('window:oryx-notify')
export class SiteNotificationCenterComponent extends ContentMixin<SiteNotificationCenterOptions>(
  LitElement
) {
  protected siteNotificationService = resolve(NotificationService);
  protected centerRef = createRef<NotificationCenterComponent>();

  // @subscribe()
  // protected notification$ = this.siteNotificationService.get().pipe(
  //   tap(async (notification) => {
  //     console.log(notification)
  //     if (!notification) return;
  //     if (!(this.centerRef.value && 'open' in this.centerRef.value)) {
  //       await customElements.whenDefined('oryx-notification-center');
  //     }
  //     if (this.componentOptions?.autoCloseTime) {
  //       notification.autoCloseTime ??=
  //         this.componentOptions.autoCloseTime * 1000;
  //     }
  //     this.centerRef.value?.open(notification);
  //   })
  // );

  protected notification = signal(this.siteNotificationService.get());

  protected notification$ = effect(async() => {

    if (!this.notification()) return;
    if (!(this.centerRef.value && 'open' in this.centerRef.value)) {
      await customElements.whenDefined('oryx-notification-center');
    }
    if (this.componentOptions?.autoCloseTime) {
      this.notification().autoCloseTime ??=
        this.componentOptions.autoCloseTime * 1000;
    }
    this.centerRef.value?.open(this.notification());
  });

  protected override render(): TemplateResult {
    const { position, enableStacking } = this.componentOptions ?? {};

    return html`<oryx-notification-center
      .position=${position}
      ${ref(this.centerRef)}
      ?stackable=${enableStacking}
    ></oryx-notification-center>`;
  }
}
