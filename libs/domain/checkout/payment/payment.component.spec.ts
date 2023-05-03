import { fixture } from '@open-wc/testing-helpers';
import {
  CheckoutPaymentService,
  CheckoutService,
  PaymentMethod,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { Observable, of, take } from 'rxjs';
import { mockCheckoutProviders, MockCheckoutService } from '../src/mocks/src';

import { CheckoutPaymentComponent } from './payment.component';
import { checkoutPaymentComponent } from './payment.def';

class MockCheckoutPaymentService implements Partial<CheckoutPaymentService> {
  getMethods = vi.fn().mockReturnValue(of([]));
  selected = vi.fn().mockReturnValue(of(null));
  select = vi.fn();
}

describe('CheckoutPaymentComponent', () => {
  let element: CheckoutPaymentComponent;
  let checkoutService: MockCheckoutService;
  let paymentService: MockCheckoutPaymentService;
  let callback: () => Observable<unknown>;

  beforeAll(async () => {
    await useComponent(checkoutPaymentComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: CheckoutPaymentService,
          useClass: MockCheckoutPaymentService,
        },
      ],
    });

    paymentService = injector.inject<MockCheckoutPaymentService>(
      CheckoutPaymentService
    );
    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    checkoutService.register.mockImplementation((param, fn) => (callback = fn));
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-payment></oryx-checkout-payment>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutPaymentComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should register the step at the checkout service', () => {
      expect(checkoutService.register).toHaveBeenCalledWith(
        'payments',
        expect.anything(),
        3
      );
    });
  });

  describe('when there are no payment methods available', () => {
    beforeEach(async () => {
      paymentService.getMethods.mockReturnValue(of([]));
      element = await fixture(
        html`<oryx-checkout-payment></oryx-checkout-payment>`
      );
    });

    it('should render an empty message', () => {
      expect(element).toContainElement('.no-methods');
    });

    it('should not render any tiles', () => {
      expect(element).not.toContainElement('oryx-tile');
    });
  });

  describe('when there are payment methods available', () => {
    beforeEach(async () => {
      paymentService.getMethods.mockReturnValue(
        of([{ id: 'foo' }, { id: 'bar' }])
      );
      element = await fixture(
        html`<oryx-checkout-payment></oryx-checkout-payment>`
      );
    });

    it('should render a tile for each method', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');
      expect(tiles?.length).toBe(2);
    });

    it('should render a radio button for each method', () => {
      const radio = element.renderRoot.querySelectorAll('input');
      expect(radio?.length).toBe(2);
    });

    it('should not render an empty message', () => {
      expect(element).not.toContainElement('.no-methods');
    });

    describe('and there is no selected method', () => {
      beforeEach(async () => {
        paymentService.selected.mockReturnValue(of(null));
        element = await fixture(
          html`<oryx-checkout-payment></oryx-checkout-payment>`
        );
      });

      it('should auto select the first', () => {
        expect(paymentService.select).toHaveBeenCalledWith('foo');
      });
    });

    describe('and there is a selected method', () => {
      beforeEach(async () => {
        paymentService.selected.mockReturnValue(of({ id: 'foo' }));
        element = await fixture(
          html`<oryx-checkout-payment></oryx-checkout-payment>`
        );
      });

      it('should select the input', () => {
        expect(element).toContainElement(`input[value='foo']:checked`);
      });

      describe('and when a method is selected', () => {
        beforeEach(async () => {
          const radio =
            element.renderRoot.querySelector<HTMLInputElement>(
              `input[value='bar']`
            );
          radio?.dispatchEvent(new Event('change'));
        });

        it('should set the associated shipping method', () => {
          expect(paymentService.select).toHaveBeenCalledWith('bar');
        });
      });
    });
  });

  describe('when the collect callback is called', () => {
    let result: unknown | null;
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-payment></oryx-checkout-payment>`
      );
      callback()
        .pipe(take(1))
        .subscribe((r) => (result = r));
    });

    it('should call the payment service to get the selected method', () => {
      expect(paymentService.selected).toHaveBeenCalled();
    });

    it('should collect the method', () => {
      expect(result).toBe(null);
    });
  });

  describe('when the payment service exposes a selected method', () => {
    beforeEach(async () => {
      paymentService.selected.mockReturnValue(
        of({ id: 'foo' } as PaymentMethod)
      );

      element = await fixture(
        html`<oryx-checkout-payment></oryx-checkout-payment>`
      );
    });

    describe('and the data is collected', () => {
      let result: PaymentMethod[] | null;
      beforeEach(async () => {
        callback()
          .pipe(take(1))
          .subscribe((r) => ((result as unknown) = r));
      });

      it('should collect the method(s)', () => {
        expect(result?.length).toBe(1);
        expect(result?.[0]?.id).toBe('foo');
      });
    });
  });
});
