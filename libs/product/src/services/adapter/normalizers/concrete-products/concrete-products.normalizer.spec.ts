/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { of, take } from 'rxjs';
import { ProductNormalizer } from '../product';
import { concreteProductsNormalizer } from './concrete-products.normalizer';
import { DeserializedAbstract } from './model';

const mockAbstracts = [
  {
    concreteProducts: [
      {
        concrete: 'A',
      },
    ],
  },
  {
    concreteProducts: [
      {
        concrete: 'B',
      },
      {
        concrete: 'C',
      },
    ],
  },
] as unknown as DeserializedAbstract[];

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
          ProductNormalizer
        );
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[1].concreteProducts![0],
          ProductNormalizer
        );
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[1].concreteProducts![1],
          ProductNormalizer
        );

        expect(normalized).toEqual([
          mockTransformed,
          mockTransformed,
          mockTransformed,
        ]);
      });
  });
});
