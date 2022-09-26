import { of, take } from 'rxjs';
import { CartNormalizers } from './cart.normalizers';
import { cartsNormalizer } from './carts.normalizers';
import { DeserializedCart } from './model';

const mockDeserializedCarts = [
  {
    currency: 'EUR',
    discounts: [{ discount: 'discount' }],
    id: 'id-1',
    priceMode: 'GROSS_MODE',
    guestCartItems: [
      {
        item: 'itemA',
      },
    ],
    store: 'DE',
    thresholds: [],
    totals: { expenseTotal: 0 },
  },
  {
    currency: 'EUR',
    discounts: [{ discount: 'discount' }],
    id: 'id-2',
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
  },
] as unknown as DeserializedCart[];

describe('Cart Normalizers', () => {
  describe('Cart Attributes Normalizer', () => {
    it('should transform DeserializedCart array into Cart array', () => {
      const mockTransformed = 'mockTransformed';
      const mockTransformer = {
        do: vi.fn().mockReturnValue(() => of(mockTransformed)),
        transform: vi.fn().mockReturnValue(of(mockTransformed)),
      };

      cartsNormalizer(mockDeserializedCarts, mockTransformer)
        .pipe(take(1))
        .subscribe((normalized) => {
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedCarts[0],
            CartNormalizers
          );
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedCarts[1],
            CartNormalizers
          );
          expect(normalized).toEqual([mockTransformed, mockTransformed]);
        });
    });
  });
});
