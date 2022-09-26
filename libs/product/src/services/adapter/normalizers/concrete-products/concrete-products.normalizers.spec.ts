/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ProductNormalizers } from '@spryker-oryx/product';
import { of, take } from 'rxjs';
import { concreteProductsNormalizer } from './concrete-products.normalizers';
import { DeserializedAbstract } from './model';

const mockAbstracts: DeserializedAbstract[] = [
  {
    concreteProducts: [
      {
        concrete: 'A',
      },
    ],
  } as DeserializedAbstract,
  {
    concreteProducts: [
      {
        concrete: 'B',
      },
      {
        concrete: 'C',
      },
    ],
  } as DeserializedAbstract,
];

describe('Concrete Products Normalizer', () => {
  it('should pass every concrete product to the ProductNormalizers via transformer', () => {
    const mockTransformed = 'mockTransformed';
    const mockTransformer = {
      transform: vi.fn().mockReturnValue(of(mockTransformed)),
      do: vi.fn().mockReturnValue(() => of(mockTransformed)),
    };
    concreteProductsNormalizer(mockAbstracts, mockTransformer)
      .pipe(take(1))
      .subscribe((normalized) => {
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[0].concreteProducts![0],
          ProductNormalizers
        );
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[1].concreteProducts![0],
          ProductNormalizers
        );
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[1].concreteProducts![1],
          ProductNormalizers
        );

        expect(normalized).toEqual([
          mockTransformed,
          mockTransformed,
          mockTransformed,
        ]);
      });
  });
});
