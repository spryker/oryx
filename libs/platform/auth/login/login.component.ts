import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { ButtonSize } from '@spryker-oryx/ui/button';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { EmptyError, firstValueFrom } from 'rxjs';
import { DefaultAuthLoginStrategy } from './default-login.strategy';
import { LoginOptions, LoginRequest } from './login.model';
import { AuthLoginStrategy } from './login.strategy';
import { styles } from './login.styles';

@defaultOptions({
  enableRememberMe: true,
  enableRedirect: true,
  passwordVisibility: PasswordVisibilityStrategy.Click,
})
@hydrate({ event: ['mouseover', 'focus'] })
export class AuthLoginComponent extends ContentMixin<LoginOptions>(LitElement) {
  static styles = styles;

  @property() isLoading?: boolean;
  @property() hasError?: boolean;

  @query('input[name=email]') email?: HTMLInputElement;
  @query('input[name=password]') password?: HTMLInputElement;
  @query('input[name=rememberme]') rememberme?: HTMLInputElement;

  protected routerService = resolve(RouterService);
  protected authLoginStrategy = resolve(
    AuthLoginStrategy,
    new DefaultAuthLoginStrategy()
  );

  protected async doLogin(loginState: LoginRequest): Promise<void> {
    this.isLoading = true;
    this.hasError = false;

    try {
      await firstValueFrom(this.authLoginStrategy.login(loginState));
    } catch (e) {
      if (e instanceof EmptyError === false) {
        this.isLoading = false;
        this.hasError = true;
      }

      return;
    }

    this.isLoading = false;

    if (this.$options()?.enableRedirect) {
      const redirectUrl = this.$options().redirectUrl;

      if (redirectUrl) {
        this.routerService.navigate(redirectUrl);
        return;
      }

      const previousRoute = await firstValueFrom(
        this.routerService.previousRoute()
      );
      const redirectRoute = previousRoute ? previousRoute : '/';
      this.routerService.navigate(redirectRoute);
    }
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    this.doLogin(this.getState());
  }

  protected override render(): TemplateResult {
    return html` ${when(
        this.hasError,
        () => html`
          <oryx-notification type="error" scheme="dark">
            ${this.i18n(
              'user.login.the-username-or-password-you-entered-is-invalid'
            )}
          </oryx-notification>
        `
      )}

      <form @submit=${this.onSubmit}>
        <oryx-input
          .label=${this.i18n('user.login.email')}
          required
          ?hasError="${this.hasError}"
        >
          <input
            type="email"
            name="email"
            required
            placeholder=${this.i18n('user.login.email')}
          />
        </oryx-input>

        <oryx-password-input
          .strategy="${this.$options()?.passwordVisibility}"
          .label=${this.i18n('login.password')}
          required
          ?hasError="${this.hasError}"
        >
          <input
            type="password"
            name="password"
            required
            placeholder=${this.i18n('login.password')}
          />
        </oryx-password-input>

        ${this.renderLoginOptions()}

        <oryx-button .size=${ButtonSize.Md} ?loading=${this.isLoading}>
          <button slot="custom" ?disabled=${this.isLoading}>
            ${this.i18n('user.log-in')}
          </button>
        </oryx-button>
      </form>`;
  }

  protected renderLoginOptions(): TemplateResult | void {
    if (
      !this.$options()?.forgotPasswordLink &&
      !this.$options()?.enableRememberMe
    ) {
      return;
    }
    return html`
      <div class="options">
        ${when(
          this.$options()?.enableRememberMe,
          () => html`<oryx-checkbox>
            <input
              type="checkbox"
              name="rememberme"
              aria-label=${this.i18n('user.login.remember-me')}
              ${this.rememberme}
            />
            ${this.i18n('user.login.remember-me')}
          </oryx-checkbox>`
        )}
        ${when(
          this.$options()?.forgotPasswordLink,
          () => html`<oryx-link>
            <a href=${this.$options()?.forgotPasswordLink}
              >${this.i18n('user.login.forgot-password?')}</a
            >
          </oryx-link>`
        )}
      </div>
    `;
  }

  protected getState(): LoginRequest {
    const email = this.email?.value ?? '';
    const password = this.password?.value ?? '';
    const rememberMe = this.rememberme?.checked ?? false;

    return { email, password, rememberMe };
  }
}

export default AuthLoginComponent;
