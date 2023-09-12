import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormFieldType, FormRenderer } from '@spryker-oryx/form';
import { GenderService, SalutationService } from '@spryker-oryx/site';
import { passwordInputComponent } from '@spryker-oryx/ui';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { RegistrationService } from '@spryker-oryx/user';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
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

describe('RegistrationComponent', () => {
  let element: UserRegistrationComponent;

  let renderer: MockFormRenderer;
  let salutationService: MockSalutationService;
  let genderService: MockGenderService;
  let registrationService: MockRegistrationService;

  beforeAll(async () => {
    await useComponent([userRegistrationComponent, passwordInputComponent]);
  });

  beforeEach(async () => {
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

    element = await fixture(
      html`<oryx-user-registration></oryx-user-registration>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should build a form', () => {
    expect(renderer.buildForm).toHaveBeenCalledWith([
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
    ]);
  });

  it('should fetch salutations on initialization', () => {
    expect(salutationService.get).toHaveBeenCalled();
  });

  it('should fetch genders on initialization', () => {
    expect(genderService.get).toHaveBeenCalled();
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

    it('should not register user', () => {
      expect(registrationService.register).not.toHaveBeenCalled();
    });
  });

  describe('when valid form is submitted', () => {
    beforeEach(async () => {
      renderer.buildForm = vi.fn().mockReturnValue(html`
        <oryx-password-input>
          <input type="password" />
        </oryx-password-input>
        <input type="checkbox" name="acceptedTerms" checked />
      `);
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

    it('should register user', () => {
      expect(registrationService.register).toHaveBeenCalled();
    });
  });
});
