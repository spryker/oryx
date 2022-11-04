import { AuthService } from '@spryker-oryx/auth';
import { CheckoutComponentMixin } from '@spryker-oryx/checkout';
import { ContentController } from '@spryker-oryx/experience';
import { layoutStyles } from '@spryker-oryx/experience/composition';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { CheckoutLoginOptions } from './login.model';

@hydratable('window:load')
export class CheckoutLoginComponent extends CheckoutComponentMixin<CheckoutLoginOptions>() {
  static styles = layoutStyles;
  protected data$ = combineLatest([
    resolve(AuthService).isAuthenticated(),
    new ContentController(this).getOptions(),
  ]);

  protected override render(): TemplateResult {
    return html`${asyncValue(
      this.data$,
      ([isAuthenticated, options]) => html`
        ${when(!isAuthenticated, () => {
          const { guestUrl, loginUrl, disableGuest } = options;

          return html` ${when(
              !disableGuest,
              () => html`<checkout-guest
                .options="${{
                  ...(guestUrl && { url: guestUrl }),
                }}"
              ></checkout-guest>`
            )}
            <auth-login
              .options="${{
                title: 'Have an account? Login',
                disableRedirect: true,
                showRememberMe: true,
                ...(loginUrl && { url: loginUrl }),
              }}"
            ></auth-login>`;
        })}
      `
    )}`;
  }
}
