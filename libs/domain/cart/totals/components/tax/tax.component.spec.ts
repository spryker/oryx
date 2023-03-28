import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { mockBaseCart, mockEmptyCart } from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartTotalsTaxComponent } from './tax.component';
import { cartTotalsTaxComponent } from './tax.def';

useComponent([cartTotalsTaxComponent]);

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

describe('CartTotalsTaxComponent', () => {
  let element: CartTotalsTaxComponent;
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
