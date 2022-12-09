import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutComponentMixin,
  CheckoutDataService,
} from '@spryker-oryx/checkout';
import { ContentController } from '@spryker-oryx/experience';
import { layoutStyles } from '@spryker-oryx/experience/composition';
import { resolve } from '@spryker-oryx/injector';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { CheckoutAuthOptions } from './auth.model';

@hydratable('window:load')
export class CheckoutAuthComponent extends CheckoutComponentMixin<CheckoutAuthOptions>() {
  static styles = layoutStyles;

  protected checkoutDataService = resolve(CheckoutDataService);

  protected options$ = new ContentController(this).getOptions();
  protected isAuthenticated$ = resolve(AuthService).isAuthenticated();
  protected isGuest$ = this.checkoutDataService.isGuestCheckout();

  protected override render(): TemplateResult {
    return html` ${this.renderHeading()}
    ${asyncValue(
      combineLatest([this.isAuthenticated$, this.isGuest$]),
      ([isAuthenticated, isGuestCheckout]) =>
        html`${when(
          !(isAuthenticated || isGuestCheckout),
          () => html`${this.renderAnonymousLogin()} ${this.renderLogin()}`
        )}`
    )}`;
  }

  protected renderHeading(): TemplateResult {
    return html`${asyncValue(
      this.isGuest$,
      (isGuestCheckout) =>
        html` ${when(
          isGuestCheckout,
          () => html`
            <oryx-heading>
              <h3>${i18n('checkout.guest-checkout')}</h3>
              <oryx-button type="text">
                <button
                  @click=${(): void => {
                    this.checkoutDataService.setIsGuestCheckout(false);
                  }}
                >
                  ${i18n('checkout.checkout-as-register')}
                </button>
              </oryx-button>
            </oryx-heading>
          `
        )}`
    )}`;
  }

  protected renderLogin(): TemplateResult {
    return html`${asyncValue(
      this.options$,
      (options) => html`<auth-login
        .options="${{
          title: i18n('checkout.authentication.login'),
          disableRedirect: true,
          showRememberMe: true,
          ...(options.loginUrl && { url: options.loginUrl }),
        }}"
      ></auth-login>`
    )}`;
  }

  protected renderAnonymousLogin(): TemplateResult {
    return html`${asyncValue(
      this.options$,
      (options) =>
        html`${when(
          !options.disableGuest,
          () => html`<checkout-guest
            @oryx.guest-submit=${() => {
              this.checkoutDataService.setIsGuestCheckout();
            }}
            .options="${{
              ...(options.guestUrl && { url: options.guestUrl }),
            }}"
          ></checkout-guest>`
        )}`
    )}`;
  }
}
