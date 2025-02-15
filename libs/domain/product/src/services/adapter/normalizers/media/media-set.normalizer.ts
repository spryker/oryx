import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ApiProductModel, ProductMediaSet } from '../../../../models';
import { ProductMediaNormalizer } from './media.normalizer';

export const ProductMediaSetNormalizer = 'oryx.ProductMediaSetNormalizer*';

export function mediaSetNormalizer(
  data: ApiProductModel.ImageSet[] = [],
  transformer: TransformerService
): Observable<ProductMediaSet[]> {
  return combineLatest(
    data.map((set) =>
      combineLatest(
        set?.images.map((image) =>
          transformer.transform(image, ProductMediaNormalizer)
        )
      ).pipe(map((images) => ({ media: images, name: set.name })))
    )
  );
}

declare global {
  interface InjectionTokensContractMap {
    [ProductMediaSetNormalizer]: Transformer<ProductMediaSet[]>[];
  }
}
