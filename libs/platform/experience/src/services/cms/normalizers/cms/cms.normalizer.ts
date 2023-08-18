import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ApiCmsModel, Component, ExperienceCms } from '../../../../models';
import { getFieldByLocale } from '../../default-cms.adapter';

export const CmsNormalizer = 'oryx.CmsNormalizer*';

export function cmsItemsNormalizer(
  data: ApiCmsModel.Model<{ data: Component }>
): ExperienceCms {
  if (data.qualifier.type === 'component') {
    return {
      components: data.data.items.map((item) => ({
        ...getFieldByLocale(item.fields.data, data.locale),
        id: getFieldByLocale(item.fields.id, data.locale),
      })),
    };
  }

  return {};
}

export const cmsNormalizer: Provider[] = [
  {
    provide: CmsNormalizer,
    useValue: cmsItemsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CmsNormalizer]: Transformer<ExperienceCms>;
  }
}
