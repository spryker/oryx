import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Observable, map } from 'rxjs';
import { ApiCmsModel, CmsModel } from '../../../../models';
import { CmsTypeNormalizer } from '../cms-type';

export const CmsNormalizer = 'oryx.CmsNormalizer*';

export function attributesNormalizer(
  records: ApiCmsModel.Model
): Partial<CmsModel> {
  return {
    qualifier: records.qualifier,
  };
}

export function itemsNormalizer(
  records: ApiCmsModel.Model,
  transformer: TransformerService
): Observable<Partial<CmsModel>> {
  const { fields } = records.type.items[0];

  return transformer
    .transform(
      { data: records.data.items, fields, locale: records.locale },
      CmsTypeNormalizer
    )
    .pipe(map((items) => ({ items })));
}

export const cmsItemsNormalizers: Provider[] = [
  {
    provide: CmsNormalizer,
    useValue: attributesNormalizer,
  },
  {
    provide: CmsNormalizer,
    useValue: itemsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CmsNormalizer]: Transformer<CmsModel>;
  }
}
