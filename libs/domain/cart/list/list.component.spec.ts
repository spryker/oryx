import { fixture, html } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { mockDefaultCart } from '@spryker-oryx/cart/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutBuilder, LayoutService } from '@spryker-oryx/experience';
import { useComponent } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { CartListComponent } from './list.component';
import { cartListComponent } from './list.def';

class MockCartService implements Partial<CartService> {
  getCarts = vi.fn().mockReturnValue(of([mockDefaultCart]));
}

class MockLayoutService implements Partial<LayoutService> {
  getStyles = vi.fn().mockReturnValue(of(null));
}

class MockLayoutBuilder implements Partial<LayoutBuilder> {
  createStylesFromOptions = vi.fn();
  getActiveLayoutRules = vi.fn().mockReturnValue(of());
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
        {
          provide: LayoutService,
          useClass: MockLayoutService,
        },
        {
          provide: LayoutBuilder,
          useClass: MockLayoutBuilder,
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

    it('should not render the list', () => {
      expect(element).not.toContainElement('oryx-cart-list-item');
    });
  });
});
