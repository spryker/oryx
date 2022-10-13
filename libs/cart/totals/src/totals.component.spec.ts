import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  mockBaseCart,
  mockCartWithDiscount,
  mockCartWithExpense,
  mockCartWithTax,
  mockEmptyCart,
} from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import {
  createInjector,
  destroyInjector,
  Injector,
} from '@spryker-oryx/injector';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartTotalsComponent } from './totals.component';
import { cartTotalsComponent } from './totals.def';
import { CartTotalsComponentOptions } from './totals.model';

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
    service.getCart.mockReturnValue(of(mockBaseCart));
    service.getTotals.mockReturnValue(of(mockBaseCart.totals));
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
      options: CartTotalsComponentOptions = {}
    ): void => {
      beforeEach(async () => {
        element = await fixture(
          html`<cart-totals .options=${options}></cart-totals>`
        );
      });
    };

    beforeEach(() => {
      service.getCart.mockReturnValue(of(mockBaseCart));
      service.getTotals.mockReturnValue(of(mockBaseCart.totals));
    });

    describe('subtotal', () => {
      describe('when hideSubtotal is not set', () => {
        renderCartTotals();
        it('should render the subtotal by default', () => {
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
      describe('when there is no discount', () => {
        beforeEach(() => {
          service.getCart.mockReturnValue(of(mockBaseCart));
          service.getTotals.mockReturnValue(of(mockBaseCart.totals));
        });

        renderCartTotals();

        it('should not render the discount', () => {
          expect(element).not.toContainElement('.discount');
        });
      });

      describe('when there is discount', () => {
        beforeEach(() => {
          service.getCart.mockReturnValue(of(mockCartWithDiscount));
          service.getTotals.mockReturnValue(of(mockCartWithDiscount.totals));
        });

        describe('when hideDiscount is not set', () => {
          renderCartTotals();
          it('should render the discounts by default', () => {
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
          it('should expand the discounts by default', () => {
            const collapsible = element.renderRoot.querySelector('.discounts');
            expect(collapsible?.hasAttribute('open')).toBe(true);
          });
        });

        describe('when collapseDiscounts is false', () => {
          renderCartTotals({ collapseDiscounts: false });
          it('should expand the discounts', () => {
            const collapsible = element.renderRoot.querySelector('.discounts');
            expect(collapsible?.hasAttribute('open')).toBe(true);
          });
        });

        describe('when collapseDiscounts is true', () => {
          renderCartTotals({ collapseDiscounts: true });
          it('should collapse the discounts', () => {
            const collapsible = element.renderRoot.querySelector('.discounts');
            expect(collapsible?.hasAttribute('open')).toBe(false);
          });
        });
      });
    });

    describe('expense', () => {
      describe('when there is no expense value', () => {
        beforeEach(() => {
          service.getCart.mockReturnValue(of(mockBaseCart));
          service.getTotals.mockReturnValue(of(mockBaseCart.totals));
        });

        renderCartTotals();

        it('should not render the expense', () => {
          expect(element).not.toContainElement('.expense');
        });
      });

      describe('when there is expense value', () => {
        beforeEach(() => {
          service.getCart.mockReturnValue(of(mockCartWithExpense));
          service.getTotals.mockReturnValue(of(mockCartWithExpense.totals));
        });

        renderCartTotals();

        describe('when hideExpense is not set', () => {
          it('should render the expense by default', () => {
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
    });

    describe('tax', () => {
      describe('when there is no tax value', () => {
        beforeEach(() => {
          service.getCart.mockReturnValue(of(mockBaseCart));
          service.getTotals.mockReturnValue(of(mockBaseCart.totals));
        });

        renderCartTotals();

        it('should not render the tax amount', () => {
          expect(element).not.toContainElement('.tax');
        });
      });

      describe('when there is tax value', () => {
        beforeEach(() => {
          service.getCart.mockReturnValue(of(mockCartWithTax));
          service.getTotals.mockReturnValue(of(mockCartWithTax.totals));
        });

        renderCartTotals();

        describe('and hideTaxAmount is not set', () => {
          it('should render the tax amount by default', () => {
            expect(element).toContainElement('.tax');
          });
        });

        describe('and hideTaxAmount is false', () => {
          renderCartTotals({ hideTaxAmount: false });
          it('should render the tax amount', () => {
            expect(element).toContainElement('.tax');
          });
        });

        describe('and hideTaxAmount is true', () => {
          renderCartTotals({ hideTaxAmount: true });
          it('should not render the tax amount', () => {
            expect(element).not.toContainElement('.tax');
          });
        });

        describe('and hideTaxMessage is not set', () => {
          renderCartTotals();
          it('should render the tax message by default', () => {
            expect(element).toContainElement('.tax-message');
          });
        });

        describe('and hideTaxMessage is false', () => {
          renderCartTotals({ hideTaxMessage: false });
          it('should render the tax message', () => {
            expect(element).toContainElement('.tax-message');
          });
        });

        describe('and hideTaxMessage is true', () => {
          renderCartTotals({ hideTaxMessage: true });
          it('should not render the tax message', () => {
            expect(element).not.toContainElement('.tax-message');
          });
        });
      });
    });

    describe('delivery', () => {
      describe('when hideDelivery is not set', () => {
        renderCartTotals();
        it('should render the delivery by default', () => {
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
