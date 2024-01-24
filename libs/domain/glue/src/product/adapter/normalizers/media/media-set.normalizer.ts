import { TransformerService } from '@spryker-oryx/core';
import { ProductMediaNormalizer, ProductMediaSet } from '@spryker-oryx/product';
import { Observable, combineLatest, map } from 'rxjs';
import { ApiProductModel } from '../../../models/product.api.model';

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
