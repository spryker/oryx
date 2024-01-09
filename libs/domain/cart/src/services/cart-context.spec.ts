import { CartQualifier } from '@spryker-oryx/cart';
import { firstValueFrom } from 'rxjs';
import { CartContextSerializer } from './cart-context';

describe('CartContextSerializer', () => {
  const serializer = new CartContextSerializer();

  describe('serialize method', () => {
    it('should return an Observable of the cart id', async () => {
      const qualifier: CartQualifier = { cartId: 'cartId' };
      const result = serializer.serialize(qualifier);
      expect(await firstValueFrom(result)).toBe(qualifier.cartId);
    });
  });

  describe('deserialize method', () => {
    it('should return an Observable of qualifier', async () => {
      const cartId = 'test';
      const result = serializer.deserialize(cartId);
      expect(await firstValueFrom(result)).toEqual({ cartId });
    });
  });
});
