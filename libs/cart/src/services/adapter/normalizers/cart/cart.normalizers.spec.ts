import { cartAttributesNormalizer } from './cart.normalizers';
import { DeserializedCart } from './model';

const mockDeserializedCart = {
  currency: 'EUR',
  discounts: [{ discount: 'discount' }],
  id: '51bc9ed7-89e6-5967-ac56-a03f92dce54d',
  priceMode: 'GROSS_MODE',
  guestCartItems: [
    {
      item: 'itemA',
    },
    {
      item: 'itemB',
    },
  ],
  store: 'DE',
  thresholds: [],
  totals: { expenseTotal: 0 },
} as unknown as DeserializedCart;

describe('Cart Normalizers', () => {
  describe('Cart Attributes Normalizer', () => {
    it('should transform DeserializedCart into Cart', () => {
      const mockResult = {
        ...mockDeserializedCart,
        products: mockDeserializedCart.guestCartItems,
      };
      delete mockResult.guestCartItems;
      const normalized = cartAttributesNormalizer(mockDeserializedCart);
      expect(normalized).toEqual(mockResult);
    });
  });
});
