/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { of, take } from 'rxjs';
import { NodeNormalizer } from '../node';
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
    categoryNodes: [{ category: 'a' }],
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
    categoryNodes: [{ category: 'b' }],
  },
] as unknown as DeserializedAbstract[];

describe('Concrete Products Normalizer', () => {
  it('should pass every concrete product to the ProductNormalizers via transformer', () => {
    const mockTransformed = { mockTransformed: 'mockTransformed' };
    const mockTransformer = {
      transform: vi.fn().mockReturnValue(of(mockTransformed)),
      do: vi.fn().mockReturnValue(() => mockTransformed),
    };
    concreteProductsNormalizer(mockAbstracts, mockTransformer)
      .pipe(take(1))
      .subscribe((normalized) => {
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[0].concreteProducts![0],
          ProductNormalizer
        );
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[0].categoryNodes,
          NodeNormalizer
        );
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[1].concreteProducts![0],
          ProductNormalizer
        );
        expect(mockTransformer.transform).not.toHaveBeenCalledWith(
          mockAbstracts[1].concreteProducts![1],
          ProductNormalizer
        );
        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockAbstracts[1].categoryNodes,
          NodeNormalizer
        );

        expect(normalized).toEqual([mockTransformed, mockTransformed]);
      });
  });
});
