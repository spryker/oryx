import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { of } from 'rxjs';
import { CartController } from './cart.controller';

class MockCartService implements Partial<CartService> {
  getEntries = vi.fn();
}

describe('Cart controller', () => {
  let service: MockCartService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
      ],
    });

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when one product in quantity "1" is in the cart', () => {
    beforeEach(async () => {
      service.getEntries.mockReturnValue(of([{ quantity: 1 }]));
    });

    it('should return total quantity', () => {
      let quantity: number | undefined;

      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => (quantity = val));
      expect(quantity).toBe(1);
    });
  });

  describe('when one product in quantity "2" is in the cart', () => {
    beforeEach(async () => {
      service.getEntries.mockReturnValue(of([{ quantity: 2 }]));
    });

    it('should return total quantity', () => {
      let quantity: number | undefined;

      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => (quantity = val));
      expect(quantity).toBe(2);
    });
  });

  describe('when two products in quantity "1" are in the cart', () => {
    beforeEach(async () => {
      service.getEntries.mockReturnValue(
        of([{ quantity: 1 }, { quantity: 1 }])
      );
    });

    it('should return total quantity', () => {
      let quantity: number | undefined;

      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => (quantity = val));
      expect(quantity).toBe(2);
    });
  });
  describe('when two products in quantity "2" are in the cart', () => {
    beforeEach(async () => {
      service.getEntries.mockReturnValue(
        of([{ quantity: 2 }, { quantity: 2 }])
      );
    });

    it('should return total quantity', () => {
      let quantity: number | undefined;

      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => (quantity = val));
      expect(quantity).toBe(4);
    });
  });
});
