import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { tap } from 'rxjs';
import { couponStyles } from './coupon.styles';

export class CouponComponent extends CartComponentMixin(
  ContentMixin(LitElement)
) {
  static styles = couponStyles;

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);
  protected localeService = resolve(LocaleService);

  protected override render(): TemplateResult {
    console.log('this.coupons()', this.$coupons());

    return html`
      <h3>Have a coupon?</h3>
      <form>
        <!-- errorMessage="The code is invalid, it might already have been used or is expired" -->
        <oryx-input><input placeholder="Coupon code" /></oryx-input>
        <oryx-button
          type="outline"
          color="neutral"
          size="md"
          @click=${this.handleClick}
          >Apply</oryx-button
        >
      </form>
      <ul>
        ${repeat(
          this.$coupons(),
          (coupon) => coupon.code,
          (coupon) => {
            let expirationDateTime = '';
            this.localeService
              .formatDate(coupon.expirationDateTime)
              .pipe(
                tap((date) => {
                  expirationDateTime = date ?? '';
                })
              )
              .subscribe();
            return html`
              <li>
                <oryx-icon type="done"></oryx-icon>
                <span class="code">${coupon.code} </span>
                <span class="name"
                  >${coupon.displayName}
                  <span>(valid till ${expirationDateTime})</span>
                </span>
              </li>
            `;
          }
        )}
      </ul>
    `;
  }

  protected handleClick(): void {
    this.cartService.addCoupon({ code: '12345wu2ca' }).subscribe({
      next: () => {
        this.notificationService.push({
          type: AlertType.Success,
          content: '"12345wu2ca" successfully applied',
        });
      },
      error: (e: Error) => console.log('coupon error:', e),
    });
  }
}
