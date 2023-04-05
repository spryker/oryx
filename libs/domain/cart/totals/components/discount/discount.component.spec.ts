import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  mockCartWithDiscount,
  mockCartWithoutDiscount,
  mockEmptyCart,
} from '@spryker-oryx/cart/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartTotalsDiscountComponent } from './discount.component';
import { cartTotalsDiscountComponent } from './discount.def';
import { DiscountRowsAppearance } from './discount.model';

useComponent([cartTotalsDiscountComponent]);

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

describe('CartTotalsDiscountComponent', () => {
  let element: CartTotalsDiscountComponent;
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

  describe('when there is no discount', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of(mockCartWithoutDiscount));
      element = await fixture(
        html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`
      );
    });

    it('should not render discounts', () => {
      const spans = element.shadowRoot?.querySelectorAll('span');
      expect(spans?.length).toBe(0);
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
      expect(spans?.[0].textContent).toContain('1 discounts');
      expect(spans?.[1].textContent).toContain('price');
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
