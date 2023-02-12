import { fixture } from '@open-wc/testing-helpers';
import { CheckoutDataService } from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import { CheckoutAddressComponent } from './address.component';
import { checkoutAddressComponent } from './address.def';

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn();
}

class MockCheckoutDataService implements Partial<CheckoutDataService> {
  setAddress = vi.fn();
}

@customElement('oryx-address-form')
class MockForm extends LitElement {
  getForm(): HTMLFormElement | null {
    return this.renderRoot.querySelector('form') as HTMLFormElement;
  }

  submit(): void {
    return;
  }

  render(): TemplateResult {
    return html`
      <form>
        <input name="test" required aria-label="test" />
      </form>
    `;
  }
}

describe('CheckoutAddressComponent', () => {
  let element: CheckoutAddressComponent;
  let addressService: MockAddressService;
  let dataService: CheckoutDataService;

  const setFakeValue = (): void => {
    (
      element.renderRoot
        .querySelector('oryx-address-form')
        ?.shadowRoot?.querySelector('input') as HTMLInputElement
    ).value = 'test';
  };

  beforeAll(async () => {
    await useComponent(checkoutAddressComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
      ],
    });

    addressService = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;
    dataService = testInjector.inject(CheckoutDataService);
    element = await fixture(html`<checkout-address></checkout-address>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when user has no address', () => {
    beforeEach(async () => {
      addressService.getAddresses = vi.fn().mockReturnValue(of(null));
      element = await fixture(html`<checkout-address></checkout-address>`);
    });

    it('should render address form component', () => {
      expect(element).toContainElement('oryx-address-form');
    });

    describe('and invalid form is submitted', () => {
      let submitResult: boolean;

      beforeEach(async () => {
        element = await fixture(html`<checkout-address></checkout-address>`);
        submitResult = element.submit();
      });

      it('should clear address details', () => {
        expect(dataService.setAddress).toHaveBeenCalledWith(null);
      });

      it('should return falsy result', () => {
        expect(submitResult).toBe(false);
      });
    });

    describe('and invalid form is reported', () => {
      const reportCallback = vi.fn();

      beforeEach(async () => {
        element = await fixture(html`<checkout-address></checkout-address>`);
        (
          element.renderRoot
            .querySelector('oryx-address-form')
            ?.shadowRoot?.querySelector('form') as HTMLFormElement
        ).reportValidity = reportCallback;

        element.submit(true);
      });

      it('should call reportValidity method of the form', () => {
        expect(reportCallback).toHaveBeenCalled();
      });
    });

    describe('and valid form is submitted', () => {
      let submitResult: boolean;

      beforeEach(async () => {
        element = await fixture(html`<checkout-address></checkout-address>`);
        setFakeValue();
        submitResult = element.submit();
      });

      it('should pass address details to the service', () => {
        expect(dataService.setAddress).toHaveBeenCalledWith({
          test: 'test',
        });
      });

      it('should return truthy result', () => {
        expect(submitResult).toBe(true);
      });
    });
  });

  describe('when user has address', () => {
    beforeEach(async () => {
      addressService.getAddresses = vi.fn().mockReturnValue(of([{}]));
      element = await fixture(html`<checkout-address></checkout-address>`);
    });

    it('should render address list component', () => {
      expect(element).toContainElement('oryx-address-list');
    });

    describe('and form submits without selected address', () => {
      let submitResult: boolean;

      beforeEach(async () => {
        addressService.getAddresses = vi.fn().mockReturnValue(of([{}]));
        element = await fixture(html`<checkout-address></checkout-address>`);
        submitResult = element.submit();
      });

      it('should clear address details', () => {
        expect(dataService.setAddress).toHaveBeenCalledWith(null);
      });

      it('should return falsy result', () => {
        expect(submitResult).toBe(false);
      });
    });

    describe('and form submits with selected address', () => {
      let submitResult: boolean;
      const formData = { test: 'test' };

      beforeEach(async () => {
        addressService.getAddresses = vi.fn().mockReturnValue(of([{}]));
        element = await fixture(html`<checkout-address></checkout-address>`);
        element.renderRoot.querySelector('oryx-address-list')?.dispatchEvent(
          new CustomEvent('oryx.select', {
            detail: { address: formData },
          })
        );

        submitResult = element.submit();
      });

      it('should pass selected address to the service', () => {
        expect(dataService.setAddress).toHaveBeenCalledWith(formData);
      });

      it('should return truthy result', () => {
        expect(submitResult).toBe(true);
      });
    });
  });
});
