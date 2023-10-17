import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartHeadingComponent } from './heading.component';
import { cartHeadingComponent } from './heading.def';

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
  let element: CartHeadingComponent;
  let service: MockCartService;

  beforeAll(async () => {
    await useComponent(cartHeadingComponent);
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

    element = await fixture(html`<oryx-cart-heading></oryx-cart-heading>`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(CartHeadingComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render its contents', () => {
    const heading = element.renderRoot.querySelector('oryx-heading');
    expect(heading?.textContent).toContain('5 items');
  });

  describe('if cart is empty', () => {
    beforeEach(async () => {
      service.isEmpty.mockReturnValue(of(true));

      element = await fixture(html`<oryx-cart-heading></oryx-cart-heading>`);
    });

    it('should not render contents', () => {
      expect(element).not.toContainElement('oryx-heading');
    });
  });
});
