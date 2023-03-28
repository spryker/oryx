import { fixture } from '@open-wc/testing-helpers';
import { CartService, cartTotalsComponent } from '@spryker-oryx/cart';
import { mockBaseCart, mockEmptyCart } from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartTotalsComponent } from './totals.component';

useComponent([cartTotalsComponent]);

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

describe('Cart totals component', () => {
  let element: CartTotalsComponent;

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

  it('is defined', async () => {
    element = await fixture(html`<oryx-cart-totals></oryx-cart-totals>`);
    expect(element).toBeInstanceOf(CartTotalsComponent);
  });

  describe('when the cart is empty', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of(mockEmptyCart));
      element = await fixture(html`<oryx-cart-totals></oryx-cart-totals>`);
    });

    it('should not render the heading', () => {
      expect(element).not.toContainElement('h2');
    });
  });

  describe('when there is a cart', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of(mockBaseCart));
      element = await fixture(html`<oryx-cart-totals></oryx-cart-totals>`);
    });

    it('should render the heading', () => {
      expect(element).toContainElement('h2');
    });

    describe('when enableSubtotal = true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableSubtotal: true }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the subtotal', () => {
        expect(element).toContainElement('oryx-cart-totals-subtotal');
      });
    });

    describe('when enableSubtotal = false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableSubtotal: false }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the subtotal', () => {
        expect(element).not.toContainElement('oryx-cart-totals-subtotal');
      });
    });

    describe('when enableDiscount = true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableDiscount: true }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the discount', () => {
        expect(element).toContainElement('oryx-cart-totals-discount');
      });
    });

    describe('when enableDiscount = false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableDiscount: false }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the discount', () => {
        expect(element).not.toContainElement('oryx-cart-totals-discount');
      });
    });

    describe('when enableTax = true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableTax: true }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the tax', () => {
        expect(element).toContainElement('oryx-cart-totals-tax');
      });
    });

    describe('when enableTax = false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableTax: false }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the tax', () => {
        expect(element).not.toContainElement('oryx-cart-totals-tax');
      });
    });

    describe('when enableDelivery = true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableDelivery: true }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the delivery', () => {
        expect(element).toContainElement('oryx-cart-totals-delivery');
      });
    });

    describe('when enableDelivery = false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableDelivery: false }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the delivery', () => {
        expect(element).not.toContainElement('oryx-cart-totals-delivery');
      });
    });

    describe('when enableExpense = true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableExpense: true }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the expense', () => {
        expect(element).toContainElement('oryx-cart-totals-expense');
      });
    });

    describe('when enableExpense = false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-totals
            .options=${{ enableExpense: false }}
          ></oryx-cart-totals>`
        );
      });
      it('should render the expense', () => {
        expect(element).not.toContainElement('oryx-cart-totals-expense');
      });
    });
  });
});
