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
import { mockCartTotals, mockNormalizedCart } from '../../src/mocks/mock-cart';
import { PriceMode } from '../../src/models';
import { CartTotalsComponent } from './totals.component';
import { cartTotalsComponent } from './totals.def';

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

  const findTitle = (title: string): HTMLHeadingElement | undefined => {
    return Array.from(element.renderRoot.querySelectorAll('h5')).find(
      (item) => item.innerText === title
    );
  };

  describe('options', () => {
    beforeEach(() => {
      service.getTotals.mockReturnValue(of(mockCartTotals));
      service.getCart.mockReturnValue(of(mockNormalizedCart));
    });

    describe('discounts', () => {
      it('should not render by default', () => {
        expect(element).not.toContainElement('oryx-collapsible');
      });

      it('should render if showDiscounts options is true', async () => {
        element = await fixture(
          html`<cart-totals .options=${{ showDiscounts: true }}></cart-totals>`
        );

        expect(element).toContainElement('oryx-collapsible');
      });
    });

    describe('tax', () => {
      it('should not render by default', () => {
        const target = findTitle('Tax');

        expect(target).toBe(undefined);
      });

      it('should render if showTax options is true', async () => {
        element = await fixture(
          html`<cart-totals .options=${{ showTax: true }}></cart-totals>`
        );

        const target = findTitle('Tax');

        expect(target).not.toBe(undefined);
      });
    });

    describe('showTaxMessage', () => {
      it('should not render by default', () => {
        expect(element).not.toContainElement('h5:last-of-type + div > div');
      });

      it('should render if showTaxMessage options is true', async () => {
        element = await fixture(
          html`<cart-totals .options=${{ showTaxMessage: true }}></cart-totals>`
        );

        expect(element).toContainElement('h5:last-of-type + div > div');
      });
    });

    it('should render delivery message from deliveryMessage option', async () => {
      const mockMessage = 'Some message';
      element = await fixture(
        html`<cart-totals
          .options=${{ deliveryMessage: mockMessage }}
        ></cart-totals>`
      );

      const target = <HTMLElement>(
        element.renderRoot.querySelector('.delivery-message')
      );

      expect(target.innerText.trim()).toBe(mockMessage);
    });
  });

  describe('tax message', () => {
    beforeEach(() => {
      service.getTotals.mockReturnValue(of(mockCartTotals));
    });

    it('should render incl. tax text if cart in a gross mode', async () => {
      service.getCart.mockReturnValue(
        of({
          ...mockNormalizedCart,
          priceMode: PriceMode.GrossMode,
        })
      );

      element = await fixture(
        html`<cart-totals .options=${{ showTaxMessage: true }}></cart-totals>`
      );
      const taxMessage = <HTMLElement>(
        element.renderRoot.querySelector('h5:last-of-type + div > div')
      );

      expect(taxMessage.innerText.trim()).toBe('incl. tax');
    });

    it('should render excl. tax text if cart in a net mode', async () => {
      service.getCart.mockReturnValue(
        of({
          ...mockNormalizedCart,
          priceMode: PriceMode.NetMode,
        })
      );

      element = await fixture(
        html`<cart-totals .options=${{ showTaxMessage: true }}></cart-totals>`
      );
      const taxMessage = <HTMLElement>(
        element.renderRoot.querySelector('h5:last-of-type + div > div')
      );

      expect(taxMessage.innerText.trim()).toBe('excl. tax');
    });
  });
});
