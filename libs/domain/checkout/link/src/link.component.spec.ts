import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { ContentLinkComponent } from '@spryker-oryx/content/link';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutLinkComponent } from './link.component';
import { checkoutLinkComponent } from './link.def';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of());
  getEntries = vi.fn().mockReturnValue(of([]));
  isEmpty = vi.fn();
  isBusy = vi.fn().mockReturnValue(of(false));
}

class mockPricingService {
  format = vi.fn();
}

describe('CheckoutLinkComponent', () => {
  let element: CheckoutLinkComponent;
  let service: MockCartService;

  beforeAll(async () => {
    await useComponent(checkoutLinkComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
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
  });

  describe('when cart is empty', () => {
    beforeEach(async () => {
      service.isEmpty.mockReturnValue(of(true));
      element = await fixture(
        html`<oryx-checkout-link uid="1"></oryx-checkout-link>`
      );
    });

    it(`should not render the link`, () => {
      expect(element).not.toContainElement('oryx-content-link');
    });
  });

  describe('when cart is not empty', () => {
    beforeEach(async () => {
      service.isEmpty.mockReturnValue(of(false));
      element = await fixture(
        html`<oryx-checkout-link uid="1"></oryx-checkout-link>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render the link`, () => {
      expect(element).toContainElement('oryx-content-link');
    });
  });

  describe('when cart is loading', () => {
    beforeEach(async () => {
      service.isBusy.mockReturnValue(of(true));
      service.isEmpty.mockReturnValue(of(false));
      element = await fixture(
        html` <oryx-checkout-link uid="1"></oryx-checkout-link>`
      );
    });

    it(`should pass the option to content link`, () => {
      const contentLink = element.renderRoot.querySelector(
        'oryx-content-link'
      ) as ContentLinkComponent;
      expect(contentLink?.options?.loading).toBe(true);
    });
  });
});
