import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { mockBaseCart, mockEmptyCart } from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartTotalsExpenseComponent } from './expense.component';
import { cartTotalsExpenseComponent } from './expense.def';

useComponent([cartTotalsExpenseComponent]);

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

describe('CartTotalsExpenseComponent', () => {
  let element: CartTotalsExpenseComponent;
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
