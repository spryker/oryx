import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutHeadingComponent } from './heading.component';
import { checkoutHeadingComponent } from './heading.def';

class MockCartService implements Partial<CartService> {
  isEmpty = vi.fn().mockReturnValue(of(false));
  getCart = vi
    .fn()
    .mockReturnValue(
      of({ products: [{ quantity: 1 }, { quantity: 3 }, { quantity: 1 }] })
    );
  getEntries = vi.fn().mockReturnValue(of([]));
}

class mockPricingService {
  format = vi.fn().mockReturnValue(of('price'));
}

describe('CartHeadingComponent', () => {
  let element: CheckoutHeadingComponent;
  let service: MockCartService;

  beforeAll(async () => {
    await useComponent(checkoutHeadingComponent);
  });

  beforeEach(async () => {
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

    element = await fixture(
      html`<oryx-checkout-heading></oryx-checkout-heading>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(CheckoutHeadingComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render its contents', () => {
    expect(element).toContainElement('oryx-checkout-header');
    expect(element.renderRoot.querySelector('h2')?.innerText.trim()).toContain(
      '5 items'
    );
  });

  describe('if cart is empty', () => {
    beforeEach(async () => {
      service.isEmpty.mockReturnValue(of(true));

      element = await fixture(
        html`<oryx-checkout-heading></oryx-checkout-heading>`
      );
    });

    it('should not render contents', () => {
      expect(element).not.toContainElement('oryx-checkout-header');
    });
  });
});
