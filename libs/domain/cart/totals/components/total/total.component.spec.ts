import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  mockBaseCart,
  mockEmptyCart,
  mockNetCart,
} from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartTotalsTotalComponent } from './total.component';
import { cartTotalsTotalComponent } from './total.def';

useComponent([cartTotalsTotalComponent]);

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

describe('CartTotalsTotalComponent', () => {
  let element: CartTotalsTotalComponent;
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
