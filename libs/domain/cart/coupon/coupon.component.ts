import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ColorType } from '@spryker-oryx/ui/link';
import { ClearIconAppearance } from '@spryker-oryx/ui/searchbox';
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
  @state() errorMessage: '' | string = '';

  @query('input[name=coupon]') coupon?: HTMLInputElement;

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);
  protected localeService = resolve(LocaleService);

  private successMessage: '' | string = '';

  protected override render(): TemplateResult | void {
    if (this.$isEmpty()) {
      return;
    }

    this.errorMessage =
      this.coupon?.value === ''
        ? `${this.i18n('coupon.insert-a-coupon')}`
        : `${this.i18n('coupon.cart-code-can-not-be-added')}`;

    this.successMessage = `${this.i18n('coupon.-successfully-applied')}`;

    return html`
      <oryx-layout>
        <h3>${this.i18n('coupon.have-a-coupon')}?</h3>

        <section>
          <oryx-input
            ?hasError="${this.hasError}"
            .errorMessage="${this.hasError ? this.errorMessage : ''}"
          >
            <input
              placeholder="${this.i18n('coupon.coupon-code')}"
              name="coupon"
            />
            <oryx-icon
              type=${IconTypes.Close}
              class="clear-icon"
              appearance=${ClearIconAppearance.Hover}
              @click=${(): void => this.clear()}
            ></oryx-icon>
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
                    slot="subtext"
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

  protected clear(): void {
    this.coupon!.value = '';
    this.hasError = false;
  }

  protected onSubmit(): void {
    this.hasError = false;

    if (!this.coupon?.value) {
      this.hasError = true;

      return;
    }

    this.cartService.addCoupon({ code: this.coupon?.value ?? '' }).subscribe({
      next: () => {
        this.notificationService.push({
          type: AlertType.Success,
          content: `${this.coupon?.value} ${this.successMessage}`,
        });

        this.coupon!.value = '';
      },
      error: () => {
        this.hasError = true;
      },
    });
  }
}
