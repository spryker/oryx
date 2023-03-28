import { fixture } from '@open-wc/testing-helpers';
import {
  CartService,
  cartTotalsDeliveryComponent,
  cartTotalsDiscountComponent,
  cartTotalsExpenseComponent,
  cartTotalsSubtotalComponent,
  cartTotalsTaxComponent,
  cartTotalsTotalComponent,
} from '@spryker-oryx/cart';
import {
  mockBaseCart,
  mockCartWithDiscount,
  mockCartWithoutDiscountRows,
  mockEmptyCart,
  mockNetCart,
} from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import {
  CartTotalsDeliveryComponent,
  CartTotalsDiscountComponent,
  CartTotalsExpenseComponent,
  CartTotalsSubtotalComponent,
  CartTotalsTaxComponent,
  CartTotalsTotalComponent,
} from './cart-total.component';
import { DiscountRowsAppearance } from './cart-total.model';

useComponent([
  cartTotalsSubtotalComponent,
  cartTotalsDiscountComponent,
  cartTotalsExpenseComponent,
  cartTotalsTaxComponent,
  cartTotalsDeliveryComponent,
  cartTotalsTotalComponent,
]);

class MockCartService {
  getTotals = vi.fn().mockReturnValue(of(null));
  getCart = vi.fn().mockReturnValue(of(null));
  getEntries = vi.fn().mockReturnValue(of([]));
  isEmpty = vi.fn().mockReturnValue(of(false));
  isBusy = vi.fn().mockReturnValue(of(false));
}

class mockPricingService {
  format = vi.fn().mockReturnValue(of('price'));
}

describe('Cart totals components', () => {
  let service: MockCartService;
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: PricingService,
          useClass: mockPricingService,
        },
      ],
    });

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('subtotal', () => {
    let element: CartTotalsSubtotalComponent;

    it('is defined', async () => {
      element = await fixture(
        html`<oryx-cart-totals-subtotal></oryx-cart-totals-subtotal>`
      );
      expect(element).toBeInstanceOf(CartTotalsSubtotalComponent);
    });

    describe('where there is a subtotal', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockBaseCart));
        element = await fixture(
          html`<oryx-cart-totals-subtotal></oryx-cart-totals-subtotal>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render label and subtotal', () => {
        const spans = element.shadowRoot?.querySelectorAll('span');
        expect(spans?.[0].textContent).toBe('Subtotal');
        expect(spans?.[1].textContent).toBe('price');
      });
    });

    describe('when the cart is empty', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockEmptyCart));
        element = await fixture(
          html`<oryx-cart-totals-subtotal></oryx-cart-totals-subtotal>`
        );
      });

      it('should not render any html', () => {
        expect(element).not.toContainElement('span');
      });
    });
  });

  describe('discounts', () => {
    let element: CartTotalsDiscountComponent;

    it('is defined', async () => {
      element = await fixture(
        html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
      );
      expect(element).toBeInstanceOf(CartTotalsDiscountComponent);
    });

    describe('when the cart is empty', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockEmptyCart));
        element = await fixture(
          html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
        );
      });

      it('should not render any html', () => {
        expect(element).not.toContainElement('span');
      });

      it('should not render discounts rows', () => {
        expect(element).not.toContainElement('ul');
      });
    });

    describe('when there are no discount rows', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockCartWithoutDiscountRows));
        element = await fixture(
          html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
        );
      });

      it('should render label and subtotal', () => {
        const spans = element.shadowRoot?.querySelectorAll('span');
        expect(spans?.[0].textContent).toBe('Discount');
        expect(spans?.[1].textContent).toBe('price');
      });

      it('should not render discounts rows', () => {
        expect(element).not.toContainElement('ul');
      });
    });

    describe('when there are discounts', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockCartWithDiscount));
        element = await fixture(
          html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
        );
      });

      it('should render label and subtotal', () => {
        const spans = element.shadowRoot?.querySelectorAll('span');
        expect(spans?.[0].textContent).toBe('Discount');
        expect(spans?.[1].textContent).toBe('price');
      });

      describe('and the discountRowsAppearance in None', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-totals-discount
              .options=${{
                discountRowsAppearance: DiscountRowsAppearance.None,
              }}
            ></oryx-cart-totals-discount>`
          );
        });

        it('should render discounts rows', () => {
          expect(element).not.toContainElement('ul');
        });
      });

      describe('and the discountRowsAppearance in Inline', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-totals-discount
              .options=${{
                discountRowsAppearance: DiscountRowsAppearance.Inline,
              }}
            ></oryx-cart-totals-discount>`
          );
        });

        it('should render discounts rows', () => {
          expect(element).toContainElement('ul');
        });
      });

      describe('and the discountRowsAppearance in Expanded', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-totals-discount
              .options=${{
                discountRowsAppearance: DiscountRowsAppearance.Expanded,
              }}
            ></oryx-cart-totals-discount>`
          );
        });

        it('should render discounts rows inside oryx-collapsible', () => {
          expect(element).toContainElement('oryx-collapsible[open] ul');
        });
      });

      describe('and the discountRowsAppearance in Collapsed', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-totals-discount
              .options=${{
                discountRowsAppearance: DiscountRowsAppearance.Collapsed,
              }}
            ></oryx-cart-totals-discount>`
          );
        });

        it('should render discounts rows inside oryx-collapsible', () => {
          expect(element).toContainElement('oryx-collapsible:not([open]) ul');
        });
      });
    });
  });

  describe('expense', () => {
    let element: CartTotalsExpenseComponent;

    it('is defined', async () => {
      element = await fixture(
        html`<oryx-cart-totals-expense></oryx-cart-totals-expense>`
      );
      expect(element).toBeInstanceOf(CartTotalsExpenseComponent);
    });

    describe('where there is a expense', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockBaseCart));
        element = await fixture(
          html`<oryx-cart-totals-expense></oryx-cart-totals-expense>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render label and expense', () => {
        const spans = element.shadowRoot?.querySelectorAll('span');
        expect(spans?.[0].textContent).toBe('Expense');
        expect(spans?.[1].textContent).toBe('price');
      });
    });

    describe('when the cart is empty', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockEmptyCart));
        element = await fixture(
          html`<oryx-cart-totals-expense></oryx-cart-totals-expense>`
        );
      });

      it('should not render any html', () => {
        expect(element).not.toContainElement('span');
      });
    });
  });

  describe('tax', () => {
    let element: CartTotalsTaxComponent;

    it('is defined', async () => {
      element = await fixture(
        html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`
      );
      expect(element).toBeInstanceOf(CartTotalsTaxComponent);
    });

    describe('where there is a tax', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockBaseCart));
        element = await fixture(
          html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render label and tax', () => {
        const spans = element.shadowRoot?.querySelectorAll('span');
        expect(spans?.[0].textContent).toBe('Tax');
        expect(spans?.[1].textContent).toBe('price');
      });
    });

    describe('when the cart is empty', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockEmptyCart));
        element = await fixture(
          html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`
        );
      });

      it('should not render any html', () => {
        expect(element).not.toContainElement('span');
      });
    });
  });

  describe('delivery', () => {
    let element: CartTotalsDeliveryComponent;

    it('is defined', async () => {
      element = await fixture(
        html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`
      );
      expect(element).toBeInstanceOf(CartTotalsDeliveryComponent);
    });

    describe('where there is a delivery', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockBaseCart));
        element = await fixture(
          html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render label and tax', () => {
        const spans = element.shadowRoot?.querySelectorAll('span');
        expect(spans?.[0].textContent).toBe('Delivery');
      });
    });

    describe('when the cart is empty', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockEmptyCart));
        element = await fixture(
          html`<oryx-cart-totals-delivery></oryx-cart-totals-delivery>`
        );
      });

      it('should not render any html', () => {
        expect(element).not.toContainElement('span');
      });
    });
  });

  describe('total', () => {
    let element: CartTotalsTotalComponent;

    it('is defined', async () => {
      element = await fixture(
        html`<oryx-cart-totals-total></oryx-cart-totals-total>`
      );
      expect(element).toBeInstanceOf(CartTotalsTotalComponent);
    });

    describe('where there is a total', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockBaseCart));
        element = await fixture(
          html`<oryx-cart-totals-total></oryx-cart-totals-total>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render label  and total ', () => {
        const spans = element.shadowRoot?.querySelectorAll('span');
        expect(spans?.[0].textContent).toBe('Total');
        expect(spans?.[1].textContent).toBe('price');
      });

      describe('and enableTaxMessage in true', () => {
        describe('and tax in included', () => {
          beforeEach(async () => {
            service.getCart.mockReturnValue(of(mockBaseCart));
            element = await fixture(
              html`<oryx-cart-totals-total
                .options=${{ enableTaxMessage: true }}
              ></oryx-cart-totals-total>`
            );
          });

          it('should render the tax message', () => {
            const spans = element.shadowRoot?.querySelectorAll('span');
            expect(spans?.[2].textContent).toContain('Tax included');
          });
        });

        describe('and tax in excluded', () => {
          beforeEach(async () => {
            service.getCart.mockReturnValue(of(mockNetCart));
            element = await fixture(
              html`<oryx-cart-totals-total
                .options=${{ enableTaxMessage: true }}
              ></oryx-cart-totals-total>`
            );
          });

          it('should render the tax message', () => {
            const spans = element.shadowRoot?.querySelectorAll('span');
            expect(spans?.[2].textContent).toContain('Tax included');
          });
        });
      });

      describe('and enableTaxMessage in false', () => {
        beforeEach(async () => {
          service.getCart.mockReturnValue(of(mockBaseCart));
          element = await fixture(
            html`<oryx-cart-totals-total
              .options=${{ enableTaxMessage: false }}
            ></oryx-cart-totals-total>`
          );
        });

        it('should render the tax message', () => {
          const spans = element.shadowRoot?.querySelectorAll('span');
          expect(spans?.length).toBe(2);
        });
      });
    });

    describe('when the cart is empty', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(mockEmptyCart));
        element = await fixture(
          html`<oryx-cart-totals-total></oryx-cart-totals-total>`
        );
      });

      it('should not render any html', () => {
        expect(element).not.toContainElement('span');
      });
    });
  });
});
