import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { NotificationService as SiteNotificationService } from '@spryker-oryx/site';
import { NotificationCenterComponent } from '@spryker-oryx/ui/notification-center';
import { hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { tap } from 'rxjs';
import { SiteNotificationCenterOptions } from './notification-center.model';

@defaultOptions({
  marginBlock: '40px',
  marginInline: '30px',
  maxWidth: '470px',
})
@hydratable('window:oryx-notify')
export class SiteNotificationCenterComponent extends ContentMixin<SiteNotificationCenterOptions>(
  LitElement
) {
  protected siteNotificationService = resolve(SiteNotificationService);

  protected centerRef = createRef<NotificationCenterComponent>();

  @subscribe()
  protected notification$ = this.siteNotificationService.get().pipe(
    tap(async (notification) => {
      if (!notification) return;
      if (!(this.centerRef.value && 'open' in this.centerRef.value)) {
        await customElements.whenDefined('oryx-notification-center');
      }
      this.centerRef.value?.open?.(notification);
    })
  );

  protected override render(): TemplateResult {
    return html`<oryx-notification-center
      .position=${this.componentOptions?.position}
      .marginBlock=${this.componentOptions?.marginBlock}
      .marginInline=${this.componentOptions?.marginInline}
      .maxWidth=${this.componentOptions?.maxWidth}
      ${ref(this.centerRef)}
    ></oryx-notification-center>`;
  }
}
