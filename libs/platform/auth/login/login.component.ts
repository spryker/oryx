import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { hydratable, i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { firstValueFrom } from 'rxjs';
import { DefaultAuthLoginStrategy } from './default-login.strategy';
import { LoginOptions, LoginRequest } from './login.model';
import { AuthLoginStrategy } from './login.strategy';
import { styles } from './login.styles';

@defaultOptions({
  enableRememberMe: true,
  enableRedirect: true,
  passwordVisibility: PasswordVisibilityStrategy.Click,
})
@hydratable(['mouseover', 'focus'])
export class AuthLoginComponent extends ContentMixin<LoginOptions>(LitElement) {
  static styles = styles;

  @property() isLoading?: boolean;
  @property() hasError?: boolean;
  @property() emailName = 'email';
  @property() passwordName = 'password';
  @property() rememberMeName = 'rememberme';

  protected emailInputRef = createRef<HTMLInputElement>();
  protected passwordInputRef = createRef<HTMLInputElement>();
  protected rememberInputRef = createRef<HTMLInputElement>();

  protected i18nService = resolve(I18nService);
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
    } catch {
      this.isLoading = false;
      this.hasError = true;
    }
  }

  protected login(event: Event): void {
    event.preventDefault();

    this.doLogin(this.getState());
  }

  protected override render(): TemplateResult {
    return html` ${when(
        this.hasError,
        () => html`
          <oryx-notification type="error" scheme="dark">
            ${i18n(
              'user.login.the-username-or-password-you-entered-is-invalid'
            )}
          </oryx-notification>
        `
      )}

      <form @submit=${this.login}>
        <oryx-input
          .label=${i18n('user.login.email')}
          required
          ?hasError="${this.hasError}"
        >
          <input
            type="email"
            name=${this.emailName}
            required
            placeholder=${i18n('user.login.email')}
            ${ref(this.emailInputRef)}
          />
        </oryx-input>

        <oryx-password-input
          .strategy="${this.$options()?.passwordVisibility}"
          .label=${i18n('login.password')}
          required
          ?hasError="${this.hasError}"
        >
          <input
            type="password"
            name=${this.passwordName}
            required
            placeholder=${i18n('login.password')}
            ${ref(this.passwordInputRef)}
          />
        </oryx-password-input>

        ${this.renderLoginOptions()}

        <oryx-button size=${Size.Sm} ?loading=${this.isLoading}>
          <button ?disabled=${this.isLoading}>${i18n('user.log-in')}</button>
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
              name=${this.rememberMeName}
              aria-label=${i18n('user.login.remember-me')}
              ${ref(this.rememberInputRef)}
            />
            ${i18n('user.login.remember-me')}
          </oryx-checkbox>`
        )}
        ${when(
          this.$options()?.forgotPasswordLink,
          () => html`<oryx-link>
            <a href=${this.$options()?.forgotPasswordLink}
              >${i18n('user.login.forgot-password?')}</a
            >
          </oryx-link>`
        )}
      </div>
    `;
  }

  protected getState(): LoginRequest {
    const email = this.emailInputRef.value?.value ?? '';
    const password = this.passwordInputRef.value?.value ?? '';
    const rememberMe = this.rememberInputRef.value?.checked ?? false;

    return { email, password, rememberMe };
  }
}

export default AuthLoginComponent;
