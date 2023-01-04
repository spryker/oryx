import { fixture } from '@open-wc/testing-helpers';
import { CheckoutDataService } from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormComponentInterface } from '@spryker-oryx/form';
import { html, LitElement, TemplateResult } from 'lit';
import { CheckoutContactComponent } from './contact.component';
import { checkoutContactComponent } from './contact.def';

class MockCheckoutDataService implements Partial<CheckoutDataService> {
  setContactDetails = vi.fn();
}

const setupFakeForm = (): void => {
  customElements.define(
    'user-contact-form',
    class extends LitElement implements FormComponentInterface {
      getForm(): HTMLFormElement | null {
        return this.renderRoot.querySelector('form') as HTMLFormElement;
      }

      render(): TemplateResult {
        return html`
          <form>
            <input name="test" required aria-label="test" />
          </form>
        `;
      }
    }
  );
};

describe('CheckoutContactComponent', () => {
  let element: CheckoutContactComponent;
  let dataService: CheckoutDataService;

  setupFakeForm();

  const setFakeValue = (): void => {
    (
      element.renderRoot
        .querySelector('user-contact-form')
        ?.shadowRoot?.querySelector('input') as HTMLInputElement
    ).value = 'test';
  };

  beforeAll(async () => {
    await useComponent(checkoutContactComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
      ],
    });

    dataService = testInjector.inject(CheckoutDataService);
    element = await fixture(html`<checkout-contact></checkout-contact>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when invalid form is submitted', () => {
    let submitResult: boolean;

    beforeEach(async () => {
      submitResult = element.submit();
    });

    it('should clear address details', () => {
      expect(dataService.setContactDetails).toHaveBeenCalledWith(null);
    });

    it('should return false', () => {
      expect(submitResult).toBe(false);
    });
  });

  describe('when invalid form is reported', () => {
    const reportCallback = vi.fn();

    beforeEach(async () => {
      (
        element.renderRoot
          .querySelector('user-contact-form')
          ?.shadowRoot?.querySelector('form') as HTMLFormElement
      ).reportValidity = reportCallback;
      element.submit(true);
    });

    it('should call reportValidity method of the form', () => {
      expect(reportCallback).toHaveBeenCalled();
    });
  });

  describe('when valid form is submitted', () => {
    let submitResult: boolean;

    beforeEach(async () => {
      element = await fixture(html`<checkout-contact></checkout-contact>`);
      setFakeValue();
      submitResult = element.submit();
    });

    it('should pass address details to the service', () => {
      expect(dataService.setContactDetails).toHaveBeenCalledWith({
        test: 'test',
      });
    });

    it('should return true', () => {
      expect(submitResult).toBe(true);
    });
  });
});
