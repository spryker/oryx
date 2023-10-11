import { CartNormalizer } from '@spryker-oryx/cart';
import { of, take } from 'rxjs';
import { cartsItemsNormalizer } from './carts.normalizer';
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

      cartsItemsNormalizer(mockDeserializedCarts, mockTransformer)
        .pipe(take(1))
        .subscribe((normalized) => {
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedCarts[0],
            CartNormalizer
          );
          expect(mockTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedCarts[1],
            CartNormalizer
          );
          expect(normalized).toEqual([mockTransformed, mockTransformed]);
        });
    });
  });
});
