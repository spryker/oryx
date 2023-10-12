import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { LitElement, TemplateResult, html } from 'lit';
import { couponStyles } from './coupon.styles';

export class CouponComponent extends ContentMixin(LitElement) {
  static styles = couponStyles;

  protected notificationService = resolve(NotificationService);

  protected override render(): TemplateResult {
    return html`
      <h3>Have a coupon?</h3>
      <form>
        <oryx-input
          errorMessage="The code is invalid, it might already have been used or is expired"
          ><input placeholder="Coupon code"
        /></oryx-input>
        <oryx-button
          type="outline"
          color="neutral"
          size="md"
          @click=${this.handleClick}
          >Apply</oryx-button
        >
      </form>
    `;
  }

  protected handleClick(): void {
    this.notificationService.push({
      type: AlertType.Success,
      content: '"1234-ABC-1234-01" successfully applied',
    });
  }
}
