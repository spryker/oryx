import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { NotificationService, PricingService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { CLOSED_MODAL_EVENT, ModalComponent } from '@spryker-oryx/ui/modal';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { mockDefaultCart } from '../src/mocks/src';
import { CartRemoveComponent } from './cart-remove.component';
import { cartRemoveComponent } from './cart-remove.def';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of(mockDefaultCart));
  deleteCart = vi.fn().mockReturnValue(of(undefined));
}

class MockNotificationService implements Partial<NotificationService> {
  push = vi.fn();
}

class MockPricingService {
  format = vi.fn().mockReturnValue(of('price'));
}

describe('CartRemoveComponent', () => {
  let element: CartRemoveComponent;
  let cartService: MockCartService;
  let notificationService: MockNotificationService;

  beforeAll(async () => {
    await useComponent(cartRemoveComponent);
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
          useClass: MockPricingService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
    });
    cartService = testInjector.inject<MockCartService>(CartService);
    notificationService =
      testInjector.inject<MockNotificationService>(NotificationService);
    element = await fixture(
      html`<oryx-cart-remove cartId="mock"></oryx-cart-remove>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should render button', () => {
    expect(element).toContainElement('oryx-button');
  });

  it('should not render confirmation modal', () => {
    expect(element).not.toContainElement('oryx-modal');
  });

  describe('when button is clicked', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('oryx-button')
        ?.dispatchEvent(new MouseEvent('click'));
    });

    it('should render opened confirmation modal with content', () => {
      const modal =
        element.renderRoot.querySelector<ModalComponent>('oryx-modal');
      expect(element).toContainElement('oryx-modal[open][enableFooter]');
      expect(modal?.heading).toContain(i18n('carts.remove.title.confirmation'));

      expect(modal?.querySelector('span')?.textContent).toContain(
        i18n('cart.remove.remove-cart-<name>-info', {
          name: mockDefaultCart.name,
        })
      );

      expect(element).toContainElement('oryx-modal oryx-button');
    });

    describe('and removing is cancelled', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-modal')
          ?.dispatchEvent(new CustomEvent(CLOSED_MODAL_EVENT));
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal');
      });
    });

    describe('and removing is confirmed', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-modal oryx-button')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should remove the cart', () => {
        expect(cartService.deleteCart).toHaveBeenCalledWith({
          cartId: mockDefaultCart.id,
        });
      });

      it('should push a notification with removed cart name', () => {
        expect(notificationService.push).toHaveBeenCalledWith({
          type: AlertType.Error,
          content: {
            token: 'carts.remove.<name>-removed',
            values: { name: mockDefaultCart.name },
          },
        });
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal');
      });
    });
  });

  describe('when cart is not available', () => {
    beforeEach(async () => {
      cartService.getCart = vi.fn().mockReturnValue(of({}));
      element = await fixture(
        html`<oryx-cart-remove cartId="mock"></oryx-cart-remove>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('oryx-modal, oryx-button');
    });
  });
});
