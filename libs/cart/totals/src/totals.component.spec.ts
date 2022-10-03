import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { useComponent } from '@spryker-oryx/core/utilities';
import {
  createInjector,
  destroyInjector,
  Injector,
} from '@spryker-oryx/injector';
import { PricingService } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { of } from 'rxjs';
import {
  mockCartTotals,
  mockEmptyCart,
  mockNormalizedCart,
} from '../../src/mocks/mock-cart';
import { CartTotalsComponent } from './totals.component';
import { cartTotalsComponent } from './totals.def';
import { CartTotalsComponentAttributes } from './totals.model';

useComponent([cartTotalsComponent]);

class MockCartService {
  getTotals = vi.fn().mockReturnValue(of(null));
  getCart = vi.fn().mockReturnValue(of(null));
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
    element = await fixture(html`<cart-totals></cart-totals>`);
    expect(element).toBeInstanceOf(CartTotalsComponent);
  });

  it('passes the a11y audit', async () => {
    service.getTotals.mockReturnValue(of(mockCartTotals));
    service.getCart.mockReturnValue(of(mockNormalizedCart));
    element = await fixture(html`<cart-totals></cart-totals>`);

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when the cart is empty', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of(mockEmptyCart));
      element = await fixture(html`<cart-totals></cart-totals>`);
    });

    it('should not render any html', () => {
      const elements = element.renderRoot.querySelectorAll('*:not(style)');
      expect(elements?.length).toBe(0);
    });
  });

  describe('options', () => {
    const renderCartTotals = (
      options: CartTotalsComponentAttributes = {}
    ): void => {
      beforeEach(async () => {
        element = await fixture(
          html`<cart-totals .options=${options}></cart-totals>`
        );
      });
    };

    beforeEach(() => {
      service.getTotals.mockReturnValue(of(mockCartTotals));
      service.getCart.mockReturnValue(of(mockNormalizedCart));
    });

    describe('subtotal', () => {
      describe('when hideSubtotal is not set', () => {
        renderCartTotals();
        it('should render the subtotal', () => {
          expect(element).toContainElement('.subtotal');
        });
      });
      describe('when hideSubtotal is false', () => {
        renderCartTotals({ hideSubtotal: false });
        it('should render the subtotal', () => {
          expect(element).toContainElement('.subtotal');
        });
      });
      describe('when hideSubtotal is true', () => {
        renderCartTotals({ hideSubtotal: true });
        it('should not render the subtotal', () => {
          expect(element).not.toContainElement('.subtotal');
        });
      });
    });

    describe('discount', () => {
      describe('when hideDiscount is not set', () => {
        renderCartTotals();
        it('should render the discounts', () => {
          expect(element).toContainElement('.discounts');
        });
      });
      describe('when hideDiscounts is false', () => {
        renderCartTotals({ hideDiscounts: false });
        it('should render the discounts', () => {
          expect(element).toContainElement('.discounts');
        });
      });
      describe('when hideDiscounts is true', () => {
        renderCartTotals({ hideDiscounts: true });
        it('should not render the discounts', () => {
          expect(element).not.toContainElement('.discounts');
        });
      });
      describe('when collapseDiscounts is not set', () => {
        renderCartTotals();
        it('should set the discounts collapsible to open', () => {
          const d = element.renderRoot.querySelector('.discounts');
          expect(d?.hasAttribute('open')).toBe(true);
        });
      });
      describe('when collapseDiscounts is false', () => {
        renderCartTotals({ collapseDiscounts: false });
        it('should set the discounts collapsible to open', () => {
          const d = element.renderRoot.querySelector('.discounts');
          expect(d?.hasAttribute('open')).toBe(true);
        });
      });
      describe('when collapseDiscounts is true', () => {
        renderCartTotals({ collapseDiscounts: true });
        it('should set the discounts collapsible to closed', () => {
          const d = element.renderRoot.querySelector('.discounts');
          expect(d?.hasAttribute('open')).toBe(false);
        });
      });
    });

    describe('expense', () => {
      describe('when hideExpense is not set', () => {
        renderCartTotals();
        it('should render the expense', () => {
          expect(element).toContainElement('.expense');
        });
      });
      describe('when hideExpense is false', () => {
        renderCartTotals({ hideExpense: false });
        it('should render the expense', () => {
          expect(element).toContainElement('.expense');
        });
      });
      describe('when hideExpense is true', () => {
        renderCartTotals({ hideExpense: true });
        it('should not render the expense', () => {
          expect(element).not.toContainElement('.expense');
        });
      });
    });

    describe('tax', () => {
      describe('when hideTaxAmount is not set', () => {
        renderCartTotals();
        it('should render the tax amount', () => {
          expect(element).toContainElement('.tax');
        });
      });
      describe('when hideTaxAmount is false', () => {
        renderCartTotals({ hideTaxAmount: false });
        it('should render the tax amount', () => {
          expect(element).toContainElement('.tax');
        });
      });
      describe('when hideTaxAmount is true', () => {
        renderCartTotals({ hideTaxAmount: true });
        it('should not render the tax amount', () => {
          expect(element).not.toContainElement('.tax');
        });
      });
      describe('when hideTaxMessage is not set', () => {
        renderCartTotals();
        it('should render the tax message', () => {
          expect(element).toContainElement('.tax-message');
        });
      });
      describe('when hideTaxMessage is false', () => {
        renderCartTotals({ hideTaxMessage: false });
        it('should render the tax message', () => {
          expect(element).toContainElement('.tax-message');
        });
      });
      describe('when hideTaxMessage is true', () => {
        renderCartTotals({ hideTaxMessage: true });
        it('should not render the tax message', () => {
          expect(element).not.toContainElement('.tax-message');
        });
      });
    });

    describe('delivery', () => {
      describe('when hideDelivery is not set', () => {
        renderCartTotals();
        it('should render the delivery', () => {
          expect(element).toContainElement('.delivery');
        });
      });
      describe('when hideDelivery is false', () => {
        renderCartTotals({ hideDelivery: false });
        it('should render the delivery', () => {
          expect(element).toContainElement('.delivery');
        });
      });
      describe('when hideDelivery is true', () => {
        renderCartTotals({ hideDelivery: true });
        it('should not render the delivery', () => {
          expect(element).not.toContainElement('.delivery');
        });
      });
    });

    describe('summary', () => {
      renderCartTotals();
      it('should render the summary', () => {
        expect(element).toContainElement('.summary');
      });
    });
  });
});
