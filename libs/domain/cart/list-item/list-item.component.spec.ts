import { fixture, html } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { mockBaseCart } from '@spryker-oryx/cart/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LinkService, PricingService } from '@spryker-oryx/site';
import { SitePriceComponent } from '@spryker-oryx/site/price';
import { Size, i18n, useComponent } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { CartListItemComponent } from './list-item.component';
import { cartListItemComponent } from './list-item.def';

const cartId = mockBaseCart.id;
const cart = { ...mockBaseCart, currency: 'EUR' };
const defaultCart = { ...mockBaseCart, currency: 'EUR', isDefault: true };
const netCart = { ...mockBaseCart, currency: 'EUR', priceMode: 'NET' };
const emptyCart = {
  ...mockBaseCart,
  currency: 'EUR',
  products: [],
  totals: {},
};

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of(cart));
  updateCart = vi.fn().mockReturnValue(of());
}

class mockPricingService {
  format = vi.fn().mockReturnValue(of('price'));
}

export class MockSemanticLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue('/cart');
}

describe('CartListItemComponent', () => {
  let element: CartListItemComponent;
  let service: MockCartService;

  beforeAll(async () => {
    await useComponent(cartListItemComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: PricingService,
          useClass: mockPricingService,
        },
        {
          provide: LinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });

    service = injector.inject<MockCartService>(CartService);

    element = await fixture(
      html`<oryx-cart-list-item cartId=${cartId}></oryx-cart-list-item>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should render collapsible', () => {
    expect(element).toContainElement('oryx-collapsible');
  });

  it('should render cart name and items count', () => {
    const span = element.renderRoot.querySelector(
      'oryx-collapsible > span:first-child'
    );
    expect(span?.textContent).toContain(cart.name);
    expect(span?.textContent).toContain(
      i18n('carts.totals.<count>-items', { count: 1 })
    );
  });

  it('should not render the chip with default label', () => {
    expect(element).not.toContainElement('oryx-chip');
  });

  it('should render the total price', () => {
    const price = element.renderRoot.querySelector(
      'oryx-site-price'
    ) as SitePriceComponent;
    expect(price.value).toBe(cart.totals.priceToPay);
    expect(price.currency).toBe(cart.currency);
  });

  it('should render price mode', () => {
    const priceMode = element.renderRoot.querySelector(
      'oryx-site-price + span'
    );
    expect(priceMode?.textContent).toContain(i18n('carts.price-mode.gross'));
  });

  it('should render entries with cart id', () => {
    expect(element).toContainElement(`oryx-cart-entries[cartId="${cartId}"]`);
  });

  //TODO: uncomment when FRW-6905 will be resolved
  // it('should render make default button', () => {
  //   expect(element).toContainElement(
  //     `.meta > oryx-button[type="outline"][size="${Size.Md}"]`
  //   );
  // });

  // describe('when make default button is clicked', () => {
  //   beforeEach(() => {
  //     element.renderRoot
  //       .querySelector('oryx-button')
  //       ?.dispatchEvent(new Event('click'));
  //   });

  //   it('should call updateCart method of the service with given cartId', () => {
  //     expect(service.updateCart).toHaveBeenCalledWith({
  //       cartId,
  //       isDefault: true,
  //     });
  //   });
  // });

  describe('when cart is default', () => {
    beforeEach(async () => {
      service.getCart = vi.fn().mockReturnValue(of(defaultCart));
      element = await fixture(
        html`<oryx-cart-list-item cartId=${cartId}></oryx-cart-list-item>`
      );
    });

    it('should render the chip with default label', () => {
      const chip = element.renderRoot.querySelector('oryx-chip');
      expect(chip?.textContent).toContain(i18n('default'));
    });

    it('should render open cart button with proper url', () => {
      const link = element.renderRoot.querySelector(
        `.meta > oryx-button[type="outline"][size="${Size.Md}"][href="/cart"]`
      );
      expect(link?.textContent).toContain(i18n('carts.open-cart'));
    });
  });

  describe('when cart has net price mode', () => {
    beforeEach(async () => {
      service.getCart = vi.fn().mockReturnValue(of(netCart));
      element = await fixture(
        html`<oryx-cart-list-item cartId=${cartId}></oryx-cart-list-item>`
      );
    });

    it('should render net price mode', () => {
      const priceMode = element.renderRoot.querySelector(
        'oryx-site-price + span'
      );
      expect(priceMode?.textContent).toContain(i18n('carts.price-mode.net'));
    });
  });

  describe('when cart is empty', () => {
    beforeEach(async () => {
      service.getCart = vi.fn().mockReturnValue(of(emptyCart));
      element = await fixture(
        html`<oryx-cart-list-item cartId=${cartId}></oryx-cart-list-item>`
      );
    });

    it('should render link button with 0 items count', () => {
      const span = element.renderRoot.querySelector(
        'oryx-collapsible > span:first-child'
      );
      expect(span?.textContent).toContain(
        i18n('carts.totals.<count>-items', { count: 0 })
      );
    });

    it('should not render entries', () => {
      expect(element).not.toContainElement('oryx-cart-entries');
    });
  });

  it('should render action buttons', () => {
    expect(element).toContainElement('.meta oryx-cart-remove');
  });
});
