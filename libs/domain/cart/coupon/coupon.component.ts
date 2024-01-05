import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ColorType } from '@spryker-oryx/ui/link';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { couponStyles } from './coupon.styles';

@hydrate({ event: ['window:load'] })
export class CouponComponent extends CartComponentMixin(
  ContentMixin(LitElement)
) {
  static styles = couponStyles;

  @state() hasError = false;

  @query('input') coupon?: HTMLInputElement;

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) return;

    return html`
      <oryx-input
        ?hasError="${this.hasError}"
        .errorMessage="${this.hasError
          ? `${
              !this.coupon?.value
                ? this.i18n('coupon.insert')
                : this.i18n('coupon.invalid')
            }`
          : ''}"
      >
        <input
          placeholder=${this.i18n('coupon.have-a-coupon')}
          @keyup=${this.onKeyup}
        />
        <oryx-button
          slot="suffix"
          .type="${ButtonType.Solid}"
          .color="${ColorType.Neutral}"
          .size=${ButtonSize.Sm}
          @click=${this.onSubmit}
        >
          ${this.i18n('coupon.apply')}
        </oryx-button>
      </oryx-input>

      ${this.renderCoupons()}
    `;
  }

  protected renderCoupons(): TemplateResult | void {
    return html`
      ${repeat(
        this.$coupons(),
        (coupon) => coupon.code,
        (coupon) => {
          return html`
            <div>
              <oryx-icon .type="${IconTypes.Check}"></oryx-icon>
              <span class="code">${coupon.code} </span>
              <span class="name">
                ${coupon.displayName}
                <oryx-date
                  .stamp=${coupon.expirationDateTime}
                  .i18nToken=${'coupon.valid-till-<date>'}
                ></oryx-date>
              </span>
            </div>
          `;
        }
      )}
    `;
  }

  protected onKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  protected onSubmit(): void {
    this.hasError = false;
    const coupon = this.coupon?.value;

    if (!coupon) {
      this.hasError = true;
      return;
    }

    this.cartService.addCoupon({ code: coupon ?? '' }).subscribe({
      next: () => {
        this.notificationService.push({
          type: AlertType.Success,
          content: {
            token: 'coupon.<coupon>-successfully-applied',
            values: { coupon },
          },
        });

        this.coupon!.value = '';
      },
      error: () => (this.hasError = true),
    });
  }
}
