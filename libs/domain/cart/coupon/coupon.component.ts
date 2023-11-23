import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
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

  @query('input[name=coupon]') coupon!: HTMLInputElement;

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);
  protected localeService = resolve(LocaleService);

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) {
      return;
    }

    return html`
      <oryx-layout>
        <h3>${this.i18n('coupon.have-a-coupon')}?</h3>

        <section>
          <oryx-input
            ?hasError="${this.hasError}"
            .errorMessage="${this.hasError
              ? `${
                  !this.coupon?.value
                    ? this.i18n('coupon.insert-a-coupon')
                    : this.i18n('coupon.cart-code-can-not-be-added')
                }`
              : ''}"
          >
            <input
              placeholder="${this.i18n('coupon.coupon-code')}"
              name="coupon"
            />
          </oryx-input>
          <oryx-button
            .type="${ButtonType.Outline}"
            .color="${ColorType.Neutral}"
            .size=${ButtonSize.Md}
            @click=${this.onSubmit}
          >
            ${this.i18n('coupon.apply')}
          </oryx-button>
        </section>
      </oryx-layout>

      <ul>
        ${repeat(
          this.$coupons(),
          (coupon) => coupon.code,
          (coupon) => {
            return html`
              <li>
                <oryx-icon type="done"></oryx-icon>
                <span class="code">${coupon.code} </span>
                <span class="name">
                  ${coupon.displayName}
                  <oryx-date
                    .stamp=${coupon.expirationDateTime}
                    .i18nToken=${'coupon.(valid-till-<date>)'}
                  ></oryx-date>
                </span>
              </li>
            `;
          }
        )}
      </ul>
    `;
  }

  protected onSubmit(): void {
    this.hasError = false;
    const coupon = this.coupon.value;

    if (!coupon) {
      this.hasError = true;

      return;
    }

    this.cartService.addCoupon({ code: coupon ?? '' }).subscribe({
      next: () => {
        this.notificationService.push({
          type: AlertType.Success,
          content: `${coupon} ${`${this.i18n(
            'coupon.-successfully-applied'
          )}`}`,
        });

        this.coupon.value = '';
      },
      error: () => {
        this.hasError = true;
      },
    });
  }
}
