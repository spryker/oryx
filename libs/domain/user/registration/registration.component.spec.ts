import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  FormFieldDefinition,
  FormFieldType,
  FormRenderer,
} from '@spryker-oryx/form';
import { GenderService, SalutationService } from '@spryker-oryx/site';
import { passwordInputComponent } from '@spryker-oryx/ui';
import {
  PasswordValidationOptions,
  PasswordVisibilityStrategy,
} from '@spryker-oryx/ui/password';
import { RegistrationService } from '@spryker-oryx/user';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { TemplateResult, html } from 'lit';
import { of, throwError } from 'rxjs';
import { beforeEach } from 'vitest';
import { UserRegistrationComponent } from './registration.component';
import { userRegistrationComponent } from './registration.def';

const mockSalutations = [
  {
    text: 'mr',
    value: 'Mr',
  },
];

const mockGenders = [
  {
    text: 'male',
    value: 'Male',
  },
];

const validFormFields: TemplateResult = html`
  <oryx-password-input>
    <input type="password" />
  </oryx-password-input>
  <input type="checkbox" name="acceptedTerms" checked />
`;

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html`
    <oryx-password-input>
      <input type="password" />
    </oryx-password-input>
    <input type="checkbox" name="acceptedTerms" />
  `);
}

class MockRegistrationService implements Partial<RegistrationService> {
  register = vi.fn().mockReturnValue(of(null));
}

class MockSalutationService implements Partial<SalutationService> {
  get = vi.fn().mockReturnValue(of(mockSalutations));
}

class MockGenderService implements Partial<GenderService> {
  get = vi.fn().mockReturnValue(of(mockGenders));
}

const defaultFields: FormFieldDefinition[] = [
  {
    id: 'salutation',
    type: FormFieldType.Select,
    required: true,
    label: i18n('user.registration.title'),
    options: mockSalutations.map((option) => ({
      ...option,
      text: i18n(`user.registration.title.${option.text}`),
    })),
  },
  {
    id: 'gender',
    type: FormFieldType.Select,
    required: true,
    label: i18n('user.registration.gender'),
    options: mockGenders.map((option) => ({
      ...option,
      text: i18n(`user.registration.title.${option.text}`),
    })),
  },
  {
    id: 'firstName',
    type: FormFieldType.Text,
    required: true,
    label: i18n('user.registration.first-name'),
  },
  {
    id: 'lastName',
    type: FormFieldType.Text,
    required: true,
    label: i18n('user.registration.last-name'),
  },
  {
    id: 'email',
    type: FormFieldType.Email,
    required: true,
    label: i18n('user.registration.email'),
    width: 100,
  },
  {
    id: 'password',
    type: FormFieldType.Password,
    required: true,
    label: i18n('user.registration.password'),
    attributes: {
      strategy: PasswordVisibilityStrategy.Click,
    },
    width: 100,
  },
  {
    id: 'acceptedTerms',
    type: FormFieldType.Boolean,
    required: true,
    label: i18n('user.registration.i-accept-the-<terms>', {
      terms: {
        value: 'terms and conditions',
        link: {
          href: '/article/terms-and-conditions',
          target: '_blank',
        },
      },
    }),
    width: 100,
    attributes: {
      hasError: false,
    },
  },
];

describe('RegistrationComponent', () => {
  let element: UserRegistrationComponent;

  let renderer: MockFormRenderer;
  let salutationService: MockSalutationService;
  let genderService: MockGenderService;
  let registrationService: MockRegistrationService;

  beforeAll(async () => {
    await useComponent([userRegistrationComponent, passwordInputComponent]);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RegistrationService,
          useClass: MockRegistrationService,
        },
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
        {
          provide: SalutationService,
          useClass: MockSalutationService,
        },
        {
          provide: GenderService,
          useClass: MockGenderService,
        },
      ],
    });

    renderer = testInjector.inject<MockFormRenderer>(FormRenderer);
    salutationService =
      testInjector.inject<MockSalutationService>(SalutationService);
    genderService = testInjector.inject<MockGenderService>(GenderService);
    registrationService =
      testInjector.inject<MockRegistrationService>(RegistrationService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when component is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-registration></oryx-user-registration>`
      );
    });

    it('should fetch salutations', () => {
      expect(salutationService.get).toHaveBeenCalled();
    });

    it('should fetch genders', () => {
      expect(genderService.get).toHaveBeenCalled();
    });

    it('should not render error message', () => {
      expect(element).not.toContainElement('oryx-notification');
    });

    it('should build a form', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(defaultFields);
    });
  });

  describe('when passwordVisibility option is provided with custom value', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-registration
          .options=${{
            passwordVisibility: PasswordVisibilityStrategy.Hover,
          }}
        ></oryx-user-registration>`
      );
    });

    it('should provide a custom passwordVisibility option to form builder method', () => {
      const expectedFields = defaultFields.map((field) => {
        if (field.id === 'password') {
          return {
            ...field,
            attributes: {
              ...field.attributes,
              strategy: PasswordVisibilityStrategy.Hover,
            },
          };
        }
        return field;
      });
      expect(renderer.buildForm).toHaveBeenCalledWith(expectedFields);
    });
  });

  describe('when termsAndConditionsLink option is provided with custom value', () => {
    const customLink = '/custom/link';

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-registration
          .options=${{
            termsAndConditionsLink: customLink,
          }}
        ></oryx-user-registration>`
      );
    });

    it('should provide a custom termsAndConditionsLink to form builder method', () => {
      const expectedFields = defaultFields.map((field) => {
        if (field.id === 'acceptedTerms') {
          return {
            ...field,
            label: i18n('user.registration.i-accept-the-<terms>', {
              terms: {
                value: 'terms and conditions',
                link: {
                  href: customLink,
                  target: '_blank',
                },
              },
            }),
          };
        }
        return field;
      });
      expect(renderer.buildForm).toHaveBeenCalledWith(expectedFields);
    });
  });

  describe('when password rules options are provided', () => {
    const passwordOptions: PasswordValidationOptions = {
      minLength: 5,
      maxLength: 10,
      minNumbers: 1,
      minSpecialChars: 2,
      minUppercaseChars: 3,
    };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-registration
          .options=${passwordOptions}
        ></oryx-user-registration>`
      );
    });

    it('should provide a custom termsAndConditionsLink to form builder method', () => {
      const expectedFields = defaultFields.map((field) => {
        if (field.id === 'password') {
          return {
            ...field,
            attributes: {
              ...field.attributes,
              ...passwordOptions,
            },
          };
        }
        return field;
      });
      expect(renderer.buildForm).toHaveBeenCalledWith(expectedFields);
    });
  });

  describe('when loginLink option is provided with custom value', () => {
    const customLink = '/custom/link';

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-registration
          .options=${{
            loginLink: customLink,
          }}
        ></oryx-user-registration>`
      );
    });

    it('should provide a custom loginLink to login button', () => {
      const loginButton =
        element.shadowRoot!.querySelector<HTMLButtonElement>('oryx-button');

      expect(loginButton?.getAttribute('href')).toBe(customLink);
    });
  });

  describe('when invalid form is submitted', () => {
    beforeEach(() => {
      const form = element.shadowRoot!.querySelector<HTMLFormElement>('form')!;
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
      });

      form.dispatchEvent(submitEvent);
    });

    it('should not call `register` method of RegistrationService', () => {
      expect(registrationService.register).not.toHaveBeenCalled();
    });

    it('should not render error message', () => {
      expect(element).not.toContainElement('oryx-notification');
    });
  });

  describe('when valid form is submitted', () => {
    beforeEach(async () => {
      renderer.buildForm.mockReturnValue(validFormFields);
      element = await fixture(
        html`<oryx-user-registration></oryx-user-registration>`
      );

      const form = element.shadowRoot!.querySelector<HTMLFormElement>('form')!;
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
      });

      form.dispatchEvent(submitEvent);
    });

    it('should call `register` method of RegistrationService', () => {
      expect(registrationService.register).toHaveBeenCalled();
    });

    it('should not render error message', () => {
      expect(element).not.toContainElement('oryx-notification');
    });
  });

  describe('when registration fails', () => {
    beforeEach(async () => {
      renderer.buildForm.mockReturnValue(validFormFields);
      registrationService.register.mockReturnValue(
        throwError(() => new Error('error'))
      );

      element = await fixture(
        html`<oryx-user-registration></oryx-user-registration>`
      );

      const form = element.shadowRoot!.querySelector<HTMLFormElement>('form')!;
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
      });

      form.dispatchEvent(submitEvent);
    });

    it('should render error message', () => {
      expect(element).toContainElement('oryx-notification');
    });
  });
});
