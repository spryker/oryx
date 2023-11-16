import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { FormRenderer } from '@spryker-oryx/form';
import { LocaleService } from '@spryker-oryx/i18n';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ColorType } from '@spryker-oryx/ui/link';
import { ClearIconAppearance } from '@spryker-oryx/ui/searchbox';
import { LitElement, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { tap } from 'rxjs';
import { couponStyles } from './coupon.styles';

export class CouponComponent extends CartComponentMixin(
  ContentMixin(LitElement)
) {
  static styles = couponStyles;

  @state() hasError = false;
  @state() errorMessageDescription: '' | string = '';

  @query('input[name=coupon]') coupon?: HTMLInputElement;

  protected fieldRenderer = resolve(FormRenderer);

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);
  protected localeService = resolve(LocaleService);

  protected override render(): TemplateResult {
    return html`
      <oryx-layout>
        <h3>${this.i18n('coupon.have-a-coupon')}?</h3>

        <form>
          <oryx-input
            ?hasError="${this.hasError}"
            .errorMessage="${this.hasError ? this.errorMessageDescription : ''}"
          >
            <input placeholder="Coupon code" name="coupon" />
            <oryx-icon
              type=${IconTypes.Close}
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
        </form>
      </oryx-layout>

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

  protected clear(): void {
    this.coupon!.value = '';
  }

  protected onSubmit(): void {
    this.hasError = false;

    // '12345wu2ca'
    this.cartService.addCoupon({ code: this.coupon?.value ?? '' }).subscribe({
      next: () => {
        this.notificationService.push({
          type: AlertType.Success,
          content: `'${this.coupon?.value}' successfully applied`,
        });

        this.coupon!.value = '';
      },
      error: (e: Error) => {
        this.hasError = true;
        this.errorMessageDescription = `Cart code can't be added`;
      },
    });
  }
}
