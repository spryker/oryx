import { ContextSerializer } from '@spryker-oryx/core';
import { ProductQualifier } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';

export class ProductWithOfferContextSerializer
  implements ContextSerializer<ProductQualifier>
{
  serialize(value: ProductQualifier): Observable<string> {
    return value?.sku
      ? of(`${value.sku}${value.offer ? `,${value.offer}` : ''}`)
      : of('');
  }

  deserialize(value: string): Observable<ProductQualifier | undefined> {
    const parts = value.split(',');
    return of({
      sku: parts[0],
      ...(parts[1] ? { offer: parts[1] } : {}),
    });
  }
}
