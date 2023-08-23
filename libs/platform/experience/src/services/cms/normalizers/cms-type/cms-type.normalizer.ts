import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Observable, combineLatest } from 'rxjs';
import { ApiCmsModel, CmsEntry } from '../../../../models';
import { CmsFieldsNormalizer } from '../cms-fields';

export const CmsTypeNormalizer = 'oryx.CmsTypeNormalizer*';

export function cmsTypeNormalizer(
  records: {
    data: ApiCmsModel.ContentType[];
    locale: ApiCmsModel.Model['locale'];
    fields: ApiCmsModel.ContentField[];
  },
  transformer: TransformerService
): Observable<CmsEntry[]> {
  return combineLatest(
    records.data.map((record) =>
      transformer.transform(
        {
          data: record.fields,
          locale: records.locale,
          fields: records.fields,
          version: record.sys.version,
          internalId: record.sys.id,
        },
        CmsFieldsNormalizer
      )
    )
  );
}

export const cmsTypesNormalizers: Provider[] = [
  {
    provide: CmsTypeNormalizer,
    useValue: cmsTypeNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CmsTypeNormalizer]: Transformer<CmsEntry[]>;
  }
}
