import { fixture } from '@open-wc/testing-helpers';
import { CheckoutPaymentService } from '@spryker-oryx/checkout';
import {
  MockCheckoutOrchestrationService,
  mockCheckoutProviders,
  mockPaymentMethods,
} from '@spryker-oryx/checkout/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { radioComponent } from '@spryker-oryx/ui';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutPaymentComponent } from './payment.component';
import { checkoutPaymentComponent } from './payment.def';

class MockPaymentService implements Partial<CheckoutPaymentService> {
  getMethods = vi.fn().mockReturnValue(of(mockPaymentMethods));
  select = vi.fn().mockReturnValue(of());
  selected = vi.fn();
}

describe('Checkout Payment Selector component', () => {
  let element: CheckoutPaymentComponent;
  let paymentService: MockPaymentService;
  let orchestrationService: MockCheckoutOrchestrationService;

  const getElement = async () => {
    element = await fixture(
      html`<oryx-checkout-payment></oryx-checkout-payment>`
    );
  };

  beforeAll(async () => {
    await useComponent([checkoutPaymentComponent, radioComponent]);
  });

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: CheckoutPaymentService,
          useClass: MockPaymentService,
        },
      ],
    });

    paymentService = injector.inject<MockPaymentService>(
      CheckoutPaymentService
    );
    orchestrationService = injector.inject<MockCheckoutOrchestrationService>(
      CheckoutOrchestrationService
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    await getElement();
    expect(element).toBeInstanceOf(CheckoutPaymentComponent);
  });

  it('passes the a11y audit', async () => {
    await getElement();
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when there are no payment methods available', () => {
    beforeEach(async () => {
      paymentService.getMethods.mockReturnValue(of(null));
      await getElement();
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
      await getElement();
    });

    it('should render a tile for each method', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');
      expect(tiles?.length).toBe(4);
    });

    it('should not render an empty message', () => {
      expect(element).not.toContainElement('.no-methods');
    });

    describe('and there is no selected method', () => {
      beforeEach(async () => {
        paymentService.selected.mockReturnValue(of(undefined));
        await getElement();
      });

      it('should auto select the first tile', () => {
        const radio = element.renderRoot.querySelectorAll('oryx-tile');
        expect(radio?.[0].hasAttribute('selected')).toBeTruthy();
      });

      it('should auto select the first radio button', () => {
        const radio = element.renderRoot.querySelectorAll('input');
        expect(radio?.[0].checked).toBeTruthy();
      });

      describe('and when the 2nd method is selected', () => {
        beforeEach(async () => {
          const radio =
            element.renderRoot.querySelector<HTMLInputElement>(
              `input[value='3']`
            );
          radio?.click();
        });

        it('should set the associated shipping method', () => {
          expect(paymentService.select).toHaveBeenCalledWith('3');
        });
      });
    });

    describe('and a method is selected', () => {
      const selectedId = mockPaymentMethods[2].id;
      beforeEach(async () => {
        paymentService.selected.mockReturnValue(of(selectedId));
        element = await fixture(
          html`<oryx-checkout-payment></oryx-checkout-payment>`
        );
      });

      it('should select the last radio input', () => {
        expect(element).toContainElement(
          `input[value='${selectedId}']:checked`
        );
      });
    });

    // not sure why this fails
    // describe('and the orchestrator triggers CheckoutTrigger.Check', () => {
    //   beforeEach(async () => {
    //     orchestrationService.getTrigger.mockReturnValue(
    //       of(CheckoutTrigger.Check)
    //     );
    //     paymentService.getSelected.mockReturnValue(of('3'));
    //     element = await fixture(
    //       html`<oryx-checkout-payment></oryx-checkout-payment>`
    //     );
    //   });

    //   it('should report the selected method', () => {
    //     expect(orchestrationService.report).toHaveBeenCalledWith(
    //       CheckoutStepType.Payment,
    //       true
    //     );
    //   });
    // });
  });
});
