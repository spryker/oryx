import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  FormFieldDefinition,
  FormFieldType,
  FormRenderer,
} from '@spryker-oryx/form';
import { RouterService } from '@spryker-oryx/router';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
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
  registrationLink: '/registration',
})
@hydrate({ event: ['mouseover', 'focus'] })
export class AuthLoginComponent extends ContentMixin<LoginOptions>(LitElement) {
  static styles = styles;

  @property() isLoading?: boolean;
  @property() hasError?: boolean;

  @query('input[name=email]') email?: HTMLInputElement;
  @query('input[name=password]') password?: HTMLInputElement;
  @query('input[name=rememberme]') rememberme?: HTMLInputElement;

  protected fieldRenderer = resolve(FormRenderer);

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
    return html`
      <oryx-heading as=${HeadingTag.H2}>
        <h1>${this.i18n('user.login.log-in')}</h1>
      </oryx-heading>

      ${when(
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
        ${this.fieldRenderer.buildForm(this.getFields())}

        <oryx-button .size=${ButtonSize.Md} ?loading=${this.isLoading}>
          <button slot="custom" ?disabled=${this.isLoading}>
            ${this.i18n('user.log-in')}
          </button>
        </oryx-button>

        ${when(
          this.$options()?.forgotPasswordLink,
          () => html`
            <oryx-button href=${this.$options()?.forgotPasswordLink} type=${
            ButtonType.Text
          }>
              ${this.i18n('user.login.forgot-password?')}</a
            </oryx-button>
          `
        )}
      </form>

      <oryx-heading>
        <h2>${this.i18n('user.login.new-customer')}</h2>
      </oryx-heading>
      <p>${this.i18n('user.login.benefits-of-registering-to-the-website')}</p>

      <oryx-button
        href=${this.$options()?.registrationLink}
        type=${ButtonType.Outline}
      >
        ${this.i18n('user.login.create-account')}
      </oryx-button>
    `;
  }

  protected getFields(): FormFieldDefinition[] {
    const rememberMe = this.$options()?.enableRememberMe
      ? [
          {
            id: 'rememberme',
            type: FormFieldType.Boolean,
            label: this.i18n('user.login.remember-me'),
          },
        ]
      : [];

    return [
      {
        id: 'email',
        type: FormFieldType.Email,
        required: true,
        label: this.i18n('user.login.email'),
        placeholder: this.i18n('user.login.email'),
      },
      {
        id: 'password',
        type: FormFieldType.Password,
        required: true,
        label: this.i18n('user.login.password'),
        placeholder: this.i18n('user.login.password'),
        attributes: {
          hasError: !!this.hasError,
        },
      },
      ...rememberMe,
    ];
  }

  protected getState(): LoginRequest {
    const email = this.email?.value ?? '';
    const password = this.password?.value ?? '';
    const rememberMe = this.rememberme?.checked ?? false;

    return { email, password, rememberMe };
  }
}

export default AuthLoginComponent;
