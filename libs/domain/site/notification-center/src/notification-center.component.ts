import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { NotificationService as SiteNotificationService } from '@spryker-oryx/site';
import {
  NotificationCenterComponent,
  NotificationPosition,
} from '@spryker-oryx/ui/notification-center';
import { hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { tap } from 'rxjs';
import { SiteNotificationCenterOptions } from './notification-center.model';

@defaultOptions({
  marginBlock: '40px',
  marginInline: '30px',
  maxWidth: '470px',
  enableStacking: true,
  position: NotificationPosition.BottomStart,
} as SiteNotificationCenterOptions)
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
    const { position, enableStacking } = this.componentOptions ?? {};
    return html`<oryx-notification-center
      .position=${position}
      style=${ifDefined(this.getStyle())}
      ${ref(this.centerRef)}
      ?stackable=${enableStacking}
    ></oryx-notification-center>`;
  }

  protected getStyle(): string | undefined {
    const {
      maxWidth,
      marginBlock: block,
      marginInline: inline,
    } = this.componentOptions ?? {};

    let style = '';
    if (maxWidth) style += `--oryx-notification-max-width: ${maxWidth};`;
    if (block) style += `--oryx-notification-margin-block: ${block};`;
    if (inline) style += `--oryx-notification-margin-inline: ${inline};`;
    return style === '' ? undefined : style;
  }
}
