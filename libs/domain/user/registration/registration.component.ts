import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  FormFieldDefinition,
  FormFieldType,
  FormRenderer,
} from '@spryker-oryx/form';
import { GenderService, SalutationService } from '@spryker-oryx/site';
import { ButtonSize } from '@spryker-oryx/ui/button';
import {
  PasswordInputComponent,
  PasswordVisibilityStrategy,
} from '@spryker-oryx/ui/password';
import { ApiUserModel, RegistrationService } from '@spryker-oryx/user';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { firstValueFrom } from 'rxjs';
import { RegistrationOptions } from './registration.model';
import { styles } from './registration.styles';

@defaultOptions({
  passwordVisibility: PasswordVisibilityStrategy.Click,
})
@hydrate({ event: ['mouseover', 'focus'] })
export class UserRegistrationComponent extends ContentMixin<RegistrationOptions>(
  LitElement
) {
  static styles = styles;

  @state() isLoading?: boolean = false;
  @state() hasGenericError?: boolean = false;
  @state() hasAgreementError?: boolean = false;
  @state() hasPasswordError?: boolean = false;

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

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (this.validateForm()) {
      this.registerUser();
    }
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
      ${when(
        this.hasGenericError,
        () => html`
          <oryx-notification type="error" scheme="dark">
            ${this.i18n('user.registration.something-went-wrong')}.
          </oryx-notification>
        `
      )}

      <form @submit=${this.onSubmit}>
        ${this.fieldRenderer.buildForm(this.getFields())}
        <oryx-password-input
          .strategy="${this.$options()?.passwordVisibility}"
          .minLength=${this.$options()?.minLength}
          .maxLength=${this.$options()?.maxLength}
          .minUppercaseChars=${this.$options()?.minUppercaseChars}
          .minNumbers=${this.$options()?.minNumbers}
          .minSpecialChars=${this.$options()?.minSpecialChars}
          .label=${this.i18n('login.password')}
          .errorMessage=${this.hasPasswordError &&
          this.i18n(
            'user.registration.password-doesn’t-satisfy-all-the-criteria'
          )}
          required
          @input=${() => (this.hasPasswordError = false)}
        >
          <input type="password" name="password" required />
        </oryx-password-input>
        <div class="agreement">
          <oryx-checkbox ?hasError=${this.hasAgreementError}>
            <input
              type="checkbox"
              name="acceptedTerms"
              required
              @change=${this.hasAgreementError && this.setCheckboxValidity}
            />
          </oryx-checkbox>
          <span>
            ${this.i18n('user.registration.i-accept-the-<terms>', {
              terms: {
                value: 'terms and conditions',
                link: {
                  href: this.$options()?.termsAndConditionsLink || '',
                  target: '_blank',
                },
              },
            })}
          </span>
        </div>
        <oryx-button
          .size=${ButtonSize.Md}
          ?loading=${this.isLoading}
          @click=${this.onSubmit}
        >
          <button slot="custom" ?disabled=${this.isLoading}>
            ${this.i18n('user.registration.sign-up')}
          </button>
        </oryx-button>
      </form>
    `;
  }

  protected getFields(): FormFieldDefinition[] {
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
      confirmPassword: this.password?.value ?? '',
      acceptedTerms: this.acceptedTerms?.checked,
    };
  }
}
