import { resolve } from '@spryker-oryx/di';
import {
  CompositionLayout,
  ContentMixin,
  defaultOptions,
} from '@spryker-oryx/experience';
import {
  FormFieldAttributes,
  FormFieldDefinition,
  FormFieldType,
  FormRenderer,
} from '@spryker-oryx/form';
import { GenderService, SalutationService } from '@spryker-oryx/site';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  PasswordInputComponent,
  PasswordVisibilityStrategy,
} from '@spryker-oryx/ui/password';
import { ApiUserModel, RegistrationService } from '@spryker-oryx/user';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, PropertyValues, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { firstValueFrom } from 'rxjs';
import { RegistrationOptions } from './registration.model';
import { styles } from './registration.styles';

@defaultOptions({
  passwordVisibility: PasswordVisibilityStrategy.Click,
  termsAndConditionsLink: '/article/terms-and-conditions',
  loginLink: '/login',
})
@hydrate({ event: ['mouseover', 'focus'] })
export class UserRegistrationComponent extends ContentMixin<RegistrationOptions>(
  LitElement
) {
  static styles = styles;

  @state() isLoading = false;
  @state() hasGenericError = false;
  @state() hasAgreementError = false;
  @state() hasPasswordError = false;

  @query('form') form?: HTMLFormElement;
  @query('oryx-password-input') passwordComponent?: PasswordInputComponent;
  @query('select[name=salutation]') salutation?: HTMLSelectElement;
  @query('select[name=gender]') gender?: HTMLSelectElement;
  @query('input[name=firstName]') firstName?: HTMLInputElement;
  @query('input[name=lastName]') secondName?: HTMLInputElement;
  @query('input[name=email]') email?: HTMLInputElement;
  @query('input[name=password]') password?: HTMLInputElement;
  @query('input[name=acceptedTerms]') acceptedTerms?: HTMLInputElement;

  protected fieldRenderer = resolve(FormRenderer);
  protected registrationService = resolve(RegistrationService);

  protected salutationService = resolve(SalutationService);
  protected salutations = signal(this.salutationService.get());

  protected genderService = resolve(GenderService);
  protected genders = signal(this.genderService.get());

  constructor() {
    super();
    this.onPasswordInput = this.onPasswordInput.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.password?.addEventListener('input', this.onPasswordInput);
    this.acceptedTerms?.addEventListener('change', this.onCheckboxChange);
  }

  disconnectedCallback(): void {
    this.password?.removeEventListener('input', this.onPasswordInput);
    this.acceptedTerms?.removeEventListener('change', this.onCheckboxChange);

    super.disconnectedCallback();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.validateForm()) {
      this.registerUser();
    }
  }

  protected onPasswordInput(): void {
    this.hasPasswordError = false;
  }

  protected onCheckboxChange(): void {
    this.hasAgreementError && this.setCheckboxValidity();
  }

  protected validateForm(): boolean {
    this.setCheckboxValidity();
    this.setPasswordValidity();
    return !!(
      this.form?.checkValidity() &&
      this.acceptedTerms?.checked &&
      this.passwordComponent?.isValid()
    );
  }

  protected setCheckboxValidity(): void {
    this.hasAgreementError = !this.acceptedTerms?.checked;
  }

  protected setPasswordValidity(): void {
    this.hasPasswordError = !this.passwordComponent?.isValid();
  }

  protected async registerUser(): Promise<void> {
    this.isLoading = true;

    try {
      await firstValueFrom(
        this.registrationService.register(this.getFormData())
      );
      this.hasGenericError = false;
    } catch (e) {
      this.hasGenericError = true;
    } finally {
      this.isLoading = false;
    }
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-heading as=${HeadingTag.H5}>
        <h2>${this.i18n('user.registration.have-an-account?')}</h2>
      </oryx-heading>

      <oryx-button
        href=${this.$options().loginLink}
        type=${ButtonType.Outline}
        size=${ButtonSize.Md}
      >
        ${this.i18n('user.registration.login')}
      </oryx-button>

      <oryx-heading>
        <h1>${this.i18n('user.registration.new-customer')}</h1>
      </oryx-heading>

      ${when(
        this.hasGenericError,
        () => html`
          <oryx-notification type="error" scheme="dark">
            ${this.i18n('user.registration.something-went-wrong')}.
          </oryx-notification>
        `
      )}

      <form @submit=${this.onSubmit}>
        <oryx-layout .layout=${CompositionLayout.Grid}>
          ${this.fieldRenderer.buildForm(this.getFields())}

          <oryx-button
            .size=${ButtonSize.Md}
            ?loading=${this.isLoading}
            @click=${this.onSubmit}
          >
            ${this.i18n('user.registration.sign-up')}
          </oryx-button>
        </oryx-layout>
      </form>
    `;
  }

  protected getFields(): FormFieldDefinition[] {
    const passwordAttributes: FormFieldAttributes = {
      minLength: this.$options()?.minLength as number,
      maxLength: this.$options()?.maxLength as number,
      minUppercaseChars: this.$options()?.minUppercaseChars as number,
      minNumbers: this.$options()?.minNumbers as number,
      minSpecialChars: this.$options()?.minSpecialChars as number,
      strategy: this.$options()?.passwordVisibility as string,
      errorMessage: this.hasPasswordError
        ? (this.i18n(
            'user.registration.password-doesn’t-satisfy-all-the-criteria'
          ) as string)
        : '',
    };

    const cleanedPasswordAttributes: FormFieldAttributes = Object.fromEntries(
      Object.entries(passwordAttributes).filter(
        ([key, value]) => value !== undefined && value !== ''
      )
    );

    return [
      {
        id: 'salutation',
        type: FormFieldType.Select,
        required: true,
        label: this.i18n('user.registration.title'),
        options: this.salutations().map((option) => ({
          ...option,
          text: this.i18n(`user.registration.title.${option.text}`),
        })),
      },
      {
        id: 'gender',
        type: FormFieldType.Select,
        required: true,
        label: this.i18n('user.registration.gender'),
        options: this.genders().map((option) => ({
          ...option,
          text: this.i18n(`user.registration.title.${option.text}`),
        })),
      },
      {
        id: 'firstName',
        type: FormFieldType.Text,
        required: true,
        label: this.i18n('user.registration.first-name'),
      },
      {
        id: 'lastName',
        type: FormFieldType.Text,
        required: true,
        label: this.i18n('user.registration.last-name'),
      },
      {
        id: 'email',
        type: FormFieldType.Email,
        required: true,
        label: this.i18n('user.registration.email'),
        width: 100,
      },
      {
        id: 'password',
        type: FormFieldType.Password,
        required: true,
        label: this.i18n('user.registration.password'),
        attributes: cleanedPasswordAttributes,
        width: 100,
      },
      {
        id: 'acceptedTerms',
        type: FormFieldType.Boolean,
        required: true,
        label: this.i18n('user.registration.i-accept-the-<terms>', {
          terms: {
            value: 'terms and conditions',
            link: {
              href: this.$options()?.termsAndConditionsLink || '',
              target: '_blank',
            },
          },
        }),
        width: 100,
        attributes: {
          hasError: this.hasAgreementError,
        },
      },
    ];
  }

  protected getFormData(): ApiUserModel.User {
    return {
      salutation: this.salutation?.value ?? '',
      gender: this.gender?.value ?? '',
      firstName: this.firstName?.value ?? '',
      lastName: this.secondName?.value ?? '',
      email: this.email?.value ?? '',
      password: this.password?.value ?? '',
      acceptedTerms: this.acceptedTerms?.checked,
    };
  }
}
