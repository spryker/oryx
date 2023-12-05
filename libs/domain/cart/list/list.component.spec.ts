import { fixture, html } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { mockDefaultCart } from '@spryker-oryx/cart/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { CartListComponent } from './list.component';
import { cartListComponent } from './list.def';

class MockCartService implements Partial<CartService> {
  getCarts = vi.fn().mockReturnValue(of([mockDefaultCart]));
}

describe('CartListComponent', () => {
  let element: CartListComponent;
  let service: MockCartService;

  beforeAll(async () => {
    await useComponent(cartListComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
      ],
    });

    service = injector.inject<MockCartService>(CartService);

    element = await fixture(html`<oryx-cart-list></oryx-cart-list>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should render heading with 1 item', () => {
    const heading = element.renderRoot.querySelector('oryx-heading');
    expect(heading?.textContent).toContain(
      i18n('cart.totals.<count>-items', { count: 1 })
    );
  });

  it('should render create cart button with correct text', () => {
    const button = element.renderRoot.querySelector('oryx-button');
    expect(button?.textContent).toContain(i18n('cart.create-cart'));
  });

  it('should render list of items with cartIds', () => {
    expect(element).toContainElement(
      `oryx-cart-list-item[cartId="${mockDefaultCart.id}"]`
    );
  });

  describe('when list is empty', () => {
    beforeEach(async () => {
      service.getCarts = vi.fn().mockReturnValue(of([]));

      element = await fixture(html`<oryx-cart-list></oryx-cart-list>`);
    });

    it('should render heading with 0 items', () => {
      const heading = element.renderRoot.querySelector('oryx-heading');
      expect(heading?.textContent).toContain(
        i18n('cart.totals.<count>-items', { count: 0 })
      );
    });

    it('should not render the list', () => {
      expect(element).not.toContainElement('oryx-cart-list-item');
    });
  });
});
