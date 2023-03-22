import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import { Size } from '@spryker-oryx/ui';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import {
  FormAssociatedElement,
  hydratable,
  i18n,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DirectiveResult } from 'lit/directive.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { catchError, EMPTY, map, of, Subject, switchMap, tap } from 'rxjs';
import { DefaultAuthLoginStrategy } from './default-login.strategy';
import { LoginOptions, LoginRequest } from './login.model';
import { AuthLoginStrategy } from './login.strategy';
import { styles } from './login.styles';

@defaultOptions({
  enableRememberMe: true,
  redirectUrl: '/',
  passwordVisibility: PasswordVisibilityStrategy.Mousedown,
})
@hydratable(['mouseover', 'focus'])
export class AuthLoginComponent
  extends ContentMixin<LoginOptions>(LitElement)
  implements FormAssociatedElement
{
  static styles = styles;
  static formAssociated = true;

  @property() heading?: DirectiveResult | string;
  @property() isLoading?: boolean;
  @property() hasError?: boolean;
  @property() emailName = 'email';
  @property() passwordName = 'password';
  @property() rememberMeName = 'rememberme';

  @state() protected isDisabled = false;

  private internals =
    typeof this.attachInternals === 'function' ? this.attachInternals() : null;

  get form(): HTMLFormElement | null {
    return this.internals?.form ?? null;
  }

  get validity(): ValidityState {
    return (
      this.internals?.validity ?? {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
      }
    );
  }

  get validationMessage(): string {
    return this.internals?.validationMessage ?? '';
  }

  get willValidate(): boolean {
    return this.internals?.willValidate ?? false;
  }

  protected emailInputRef = createRef<HTMLInputElement>();
  protected passwordInputRef = createRef<HTMLInputElement>();
  protected rememberInputRef = createRef<HTMLInputElement>();

  protected i18nService = resolve(I18nService);
  protected routerService = resolve(RouterService);
  protected authLoginStrategy = resolve(
    AuthLoginStrategy,
    new DefaultAuthLoginStrategy(this)
  );

  protected validationError?: string;

  @subscribe()
  protected validationError$ = this.i18nService
    .translate('auth.email-and/or-password-is-required')
    .pipe(
      tap((errorMsg) => {
        this.validationError = errorMsg;
        this.updateValidity();
      })
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
        catchError(() => {
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

  checkValidity(): boolean {
    return this.internals?.checkValidity() ?? true;
  }

  reportValidity(): boolean {
    return this.internals?.reportValidity() ?? true;
  }

  formDisabledCallback(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  formStateRestoreCallback(state: unknown): void {
    if (state instanceof FormData) {
      this.setState(state);
    }
  }

  formResetCallback(): void {
    this.setState(new FormData());
  }

  protected override render(): TemplateResult {
    return html`<oryx-card>
      <oryx-heading slot="heading" as="h5">
        <h1>${this.heading ?? i18n('user.login')}</h1>
      </oryx-heading>

      ${when(
        this.hasError,
        () => html`
          <oryx-notification type="error">
            ${i18n('user.login.not-valid')}
          </oryx-notification>
        `
      )}

      <div class="login-form">
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

        <oryx-button size=${Size.Sm}>
          <button ?disabled=${this.isLoading} @click=${this.login}>
            ${i18n('user.login')}
          </button>
        </oryx-button>
      </div>
    </oryx-card>`;
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

  protected setState(data: FormData): void {
    if (this.emailInputRef.value) {
      this.emailInputRef.value.value = String(data.get(this.emailName) ?? '');
    }
    if (this.passwordInputRef.value) {
      this.passwordInputRef.value.value = String(
        data.get(this.passwordName) ?? ''
      );
    }
    if (this.rememberInputRef.value) {
      this.rememberInputRef.value.checked = data.has(this.rememberMeName);
    }

    this.updateFormValue();
  }

  protected updateFormValue(): void {
    if (!this.internals) {
      return this.updateValidity();
    }

    const data = this.getState();
    const formData = new FormData();

    formData.set(this.emailName, data.email);
    formData.set(this.passwordName, data.password);

    if (this.componentOptions?.enableRememberMe && data.rememberMe) {
      formData.set(this.rememberMeName, 'true');
    }

    this.internals.setFormValue(formData);

    this.updateValidity();
  }

  protected updateValidity(): void {
    const data = this.getState();

    const valueMissing = !data.email || !data.password;

    if (!this.internals) {
      return;
    }

    if (!valueMissing) {
      return this.internals.setValidity({});
    }

    this.internals.setValidity(
      { valueMissing },
      this.validationError,
      !data.email ? this.emailInputRef.value : this.passwordInputRef.value
    );
  }
}

export default AuthLoginComponent;
