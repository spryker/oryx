import { Transformer, TransformerService } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Observable, combineLatest, map } from 'rxjs';
import { ApiCmsModel, CmsEntry } from '../../../../models';
import { CmsFieldNormalizer } from '../cms-field';

export const CmsFieldsNormalizer = 'oryx.CmsFieldsNormalizer*';

export function fieldsNormalizer(
  data: {
    data: ApiCmsModel.ContentType;
    locale: ApiCmsModel.Model['locale'];
    fields: Record<string, ApiCmsModel.ContentField>;
    version: number;
    internalId: string;
  },
  transformer: TransformerService
): Observable<CmsEntry> {
  return combineLatest(
    Object.entries(data.data).map(([key, value]) => {
      const { localized, type } = data.fields[key] ?? {};
      const record = localized ? value[data.locale] : Object.values(value)[0];

      return transformer.transform(
        { key, value: record, type },
        CmsFieldNormalizer
      );
    })
  ).pipe(
    map((records) =>
      records.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {
        version: data.version,
        id: '',
        internalId: data.internalId,
      })
    )
  );
}

export const cmsFieldsNormalizers: Provider[] = [
  {
    provide: CmsFieldsNormalizer,
    useValue: fieldsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CmsFieldsNormalizer]: Transformer<CmsEntry>;
  }
}
