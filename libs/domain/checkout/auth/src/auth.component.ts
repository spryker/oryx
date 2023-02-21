import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutComponentMixin,
  CheckoutDataService,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { CheckoutAuthOptions } from './auth.model';
import { authStyles } from './auth.styles';

@hydratable('window:load')
export class CheckoutAuthComponent extends CheckoutComponentMixin<CheckoutAuthOptions>() {
  static styles = [authStyles];

  protected checkoutDataService = resolve(CheckoutDataService);

  protected options$ = new ContentController(this).getOptions();
  protected isAuthenticated$ = resolve(AuthService).isAuthenticated();
  protected isGuest$ = this.checkoutDataService.isGuestCheckout();

  protected override render(): TemplateResult {
    return html`
      ${this.renderHeading()}
      ${asyncValue(
        combineLatest([this.isAuthenticated$, this.isGuest$]),
        ([isAuthenticated, isGuestCheckout]) =>
          html`${when(
            !(isAuthenticated || isGuestCheckout),
            () => html`${this.renderAnonymousLogin()} ${this.renderLogin()}`
          )}`
      )}
    `;
  }

  protected renderHeading(): TemplateResult {
    return html`
      ${asyncValue(
        this.isGuest$,
        (isGuestCheckout) =>
          html` ${when(
            isGuestCheckout,
            () => html`
              <oryx-heading>
                <h3>${i18n('checkout.guest-checkout')}</h3>
                <oryx-button type="text">
                  <button
                    @click=${() =>
                      this.checkoutDataService.setGuestCheckout(false)}
                  >
                    ${i18n('checkout.checkout-as-register')}
                  </button>
                </oryx-button>
              </oryx-heading>
            `
          )}`
      )}
    `;
  }

  protected renderLogin(): TemplateResult {
    return html`${asyncValue(
      this.options$,
      (options) => html`<oryx-auth-login
        .heading=${i18n('checkout.authentication.login')}
        .options=${{
          disableRedirect: !options.loginUrl,
          ...(options.loginUrl && { redirectUrl: options.loginUrl }),
        }}
      ></oryx-auth-login>`
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
              this.checkoutDataService.setGuestCheckout();
            }}
            .options="${{
              ...(options.guestUrl && { redirectUrl: options.guestUrl }),
            }}"
          ></checkout-guest>`
        )}`
    )}`;
  }
}
