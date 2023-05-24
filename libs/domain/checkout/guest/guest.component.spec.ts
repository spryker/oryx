import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
import { SemanticLinkService } from '@spryker-oryx/site';
import { html } from 'lit';
import { CheckoutGuestComponent } from '../guest';
import { mockCheckoutProviders } from '../src/mocks/src';
import { CheckoutDataService, CheckoutStateService } from '../src/services';
import { checkoutGuestComponent } from './guest.def';

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
}

describe('CheckoutGuestComponent', () => {
  let element: CheckoutGuestComponent;
  let formRenderer: MockFormRenderer;
  let checkoutStateService: MockCheckoutStateService;

  beforeAll(async () => {
    await useComponent(checkoutGuestComponent);
  });

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: CheckoutStateService,
          useClass: MockCheckoutStateService,
        },
      ],
    });

    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
    formRenderer = injector.inject<MockFormRenderer>(FormRenderer);
    formRenderer.buildForm.mockReturnValue(
      html`<input type="email" name="email" placeholder="email" required />`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-guest></oryx-checkout-guest>`
      );
    });

    it('should be an instance of CheckoutGuestComponent', () => {
      expect(element).toBeInstanceOf(CheckoutGuestComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the form data is changed', () => {
    let form: HTMLFormElement;
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-guest></oryx-checkout-guest>`
      );
      form = element.renderRoot.querySelector('form') as HTMLFormElement;
      form.reportValidity = vi.fn();
    });

    describe('and the form data is invalid', () => {
      beforeEach(() => {
        const input = form?.querySelector('input') as HTMLInputElement;
        input.value = 'invalid';
        form?.dispatchEvent(new Event('change'));
      });

      it('should set the invalid customer state', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith('customer', {
          value: { email: 'invalid' },
          valid: false,
        });
      });

      describe('and isValid() is called', () => {
        beforeEach(() => {
          form.checkValidity = vi.fn();
        });

        describe('and the report argument is true', () => {
          beforeEach(async () => {
            element.isValid(true);
          });

          it('should call checkValidity', () => {
            expect(form.checkValidity).toHaveBeenCalled();
          });

          it('should report form validation', () => {
            expect(form.reportValidity).toHaveBeenCalled();
          });
        });

        describe('and the report argument is false', () => {
          beforeEach(async () => {
            element.isValid(false);
          });

          it('should call checkValidity', () => {
            expect(form.checkValidity).toHaveBeenCalled();
          });

          it('should not report form validation', () => {
            expect(form.reportValidity).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('and the form data is valid', () => {
      beforeEach(() => {
        const input = form?.querySelector('input') as HTMLInputElement;
        input.value = 'valid@mail.com';
        form?.dispatchEvent(new Event('change'));
      });

      it('should set the invalid customer state', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith('customer', {
          value: { email: 'valid@mail.com' },
          valid: true,
        });
      });

      describe('and isValid() is called', () => {
        beforeEach(() => {
          form.checkValidity = vi.fn();
        });

        describe('and the report argument is true', () => {
          beforeEach(async () => {
            element.isValid(true);
          });

          it('should call checkValidity', () => {
            expect(form.checkValidity).toHaveBeenCalled();
          });

          it('should report form validation', () => {
            expect(form.reportValidity).toHaveBeenCalled();
          });
        });

        describe('and the report argument is false', () => {
          beforeEach(async () => {
            element.isValid(false);
          });

          it('should call checkValidity', () => {
            expect(form.checkValidity).toHaveBeenCalled();
          });

          it('should not report form validation', () => {
            expect(form.reportValidity).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
