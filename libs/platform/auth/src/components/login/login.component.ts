import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { hydratable, i18n, Size, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { catchError, EMPTY, map, of, Subject, switchMap, tap } from 'rxjs';
import { DefaultAuthLoginStrategy } from './default-login.strategy';
import { LoginOptions, LoginRequest } from './login.model';
import { AuthLoginStrategy } from './login.strategy';
import { styles } from './login.styles';

@defaultOptions({
  enableRememberMe: true,
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

  @state() protected isDisabled = false;

  protected emailInputRef = createRef<HTMLInputElement>();
  protected passwordInputRef = createRef<HTMLInputElement>();
  protected rememberInputRef = createRef<HTMLInputElement>();

  protected i18nService = resolve(I18nService);
  protected routerService = resolve(RouterService);
  protected authLoginStrategy = resolve(
    AuthLoginStrategy,
    new DefaultAuthLoginStrategy()
  );

  protected doLogin$ = new Subject<LoginRequest>();

  @subscribe()
  protected login$ = this.doLogin$.pipe(
    tap(() => {
      this.isLoading = true;
      this.hasError = false;
    }),
    switchMap((request) =>
      this.authLoginStrategy.login(request).pipe(
        catchError((e) => {
          this.isLoading = false;
          this.hasError = true;
          return EMPTY;
        })
      )
    ),
    tap(() => (this.isLoading = false)),
    switchMap(() => {
      if (this.componentOptions?.disableRedirect) {
        return EMPTY;
      }
      if (this.componentOptions?.redirectUrl) {
        return of(this.componentOptions?.redirectUrl);
      }
      return this.routerService
        .previousRoute()
        .pipe(map((previousRoute) => previousRoute ?? '/'));
    }),
    tap((redirectUrl) => this.routerService.navigate(redirectUrl))
  );

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
          .strategy="${this.componentOptions?.passwordVisibility}"
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
      !this.componentOptions?.forgotPasswordLink &&
      !this.componentOptions?.enableRememberMe
    ) {
      return;
    }
    return html`
      <div class="options">
        ${when(
          this.componentOptions?.enableRememberMe,
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
          this.componentOptions?.forgotPasswordLink,
          () => html`<oryx-link>
            <a href=${this.componentOptions?.forgotPasswordLink}
              >${i18n('user.login.forgot-password?')}</a
            >
          </oryx-link>`
        )}
      </div>
    `;
  }

  protected login(event: Event): void {
    event.preventDefault();
    this.doLogin$.next(this.getState());
  }

  protected getState(): LoginRequest {
    const email = this.emailInputRef.value?.value ?? '';
    const password = this.passwordInputRef.value?.value ?? '';
    const rememberMe = this.rememberInputRef.value?.checked ?? false;

    return { email, password, rememberMe };
  }
}

export default AuthLoginComponent;
