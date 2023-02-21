import { AuthService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import {
  asyncState,
  hydratable,
  i18n,
  subscribe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DirectiveResult } from 'lit/directive';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, catchError, EMPTY, take, tap } from 'rxjs';
import { LoginOptions } from './login.model';
import { styles } from './login.styles';

@defaultOptions({
  enableRememberMe: true,
  redirectUrl: '/',
  passwordVisibility: PasswordVisibilityStrategy.Mousedown,
})
@hydratable(['mouseover', 'focus'])
export class AuthLoginComponent extends ContentMixin<LoginOptions>(LitElement) {
  static styles = [styles];

  @property() heading?: DirectiveResult | string;

  protected authService = resolve(AuthService);
  protected routerService = resolve(RouterService);

  protected success$ = new BehaviorSubject(true);
  protected loading$ = new BehaviorSubject(false);

  @asyncState()
  protected isLoading = valueType(this.loading$);

  @asyncState()
  protected hasSuccess = valueType(this.success$);

  @subscribe()
  protected auth = this.authService.isAuthenticated().pipe(
    tap((success) => {
      this.loading$.next(false);
      if (success) {
        this.redirect();
      }
    })
  );

  protected override render(): TemplateResult {
    return html`<oryx-card>
      <oryx-heading slot="heading" appearance="h5">
        <h1>${this.heading ?? i18n('user.login')}</h1>
      </oryx-heading>

      ${when(
        !this.hasSuccess,
        () => html`
          <oryx-notification type="error">
            ${i18n('user.login.not-valid')}
          </oryx-notification>
        `
      )}

      <form @submit=${this.handleLogin} method="post">
        <oryx-input
          label=${i18n('user.login.email')}
          required
          ?hasError="${!this.hasSuccess}"
        >
          <input
            type="email"
            name="email"
            required
            placeholder=${i18n('user.login.email')}
          />
        </oryx-input>

        <oryx-password-input
          strategy="${ifDefined(this.componentOptions?.passwordVisibility)}"
          label=${i18n('login.password')}
          required
          ?hasError="${!this.hasSuccess}"
        >
          <input
            type="password"
            name="password"
            required
            placeholder=${i18n('login.password')}
          />
        </oryx-password-input>

        ${this.renderLoginOptions()}

        <oryx-button size="small">
          <button ?disabled=${this.isLoading}>${i18n('user.login')}</button>
        </oryx-button>
      </form>
    </oryx-card>`;
  }

  protected renderLoginOptions(): TemplateResult | void {
    if (
      !this.componentOptions?.enableForgotPassword &&
      !this.componentOptions?.enableRememberMe
    ) {
      return;
    }
    return html`
      <div class="options">
        ${when(
          this.componentOptions.enableRememberMe,
          () => html`<oryx-checkbox>
            <input type="checkbox" name="rememberMe" />
            ${i18n('user.login.remember-me')}
          </oryx-checkbox>`
        )}
        ${when(
          this.componentOptions.enableForgotPassword,
          () => html`<oryx-link class="forgot-password">
            <a href="#">${i18n('user.login.forgot-password?')}</a>
          </oryx-link>`
        )}
      </div>
    `;
  }

  protected handleLogin(e: Event): void {
    e.preventDefault();
    this.loading$.next(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get('email') as string;
    const password = formData.get('password') as string;
    const remember = !!formData.get('rememberMe');

    if (username && password) {
      this.authService
        .login({ username, password, remember })
        .pipe(
          take(1),
          catchError(() => {
            this.success$.next(false);
            this.loading$.next(false);
            return EMPTY;
          })
        )
        .subscribe(() => this.redirect());
    }
  }

  protected redirect(): void {
    this.success$.next(true);

    if (this.componentOptions.disableRedirect) return;

    if (this.componentOptions.redirectUrl) {
      this.routerService.navigate(this.componentOptions.redirectUrl);
    }

    this.routerService
      .previousRoute()
      .pipe(take(1))
      .subscribe((route) => this.routerService.navigate(route ?? '/'));
  }
}
