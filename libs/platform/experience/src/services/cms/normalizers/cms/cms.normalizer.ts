import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ApiCmsModel, Component, ExperienceCms } from '../../../../models';

export const CmsNormalizer = 'oryx.CmsNormalizer*';

export function cmsItemsNormalizer(
  data: ApiCmsModel.Model<{ data: Component; id: string }>
): ExperienceCms {
  if (data.qualifier.type === 'component') {
    return {
      components: data.data.items.map((item) => ({
        ...item.fields.data,
        id: item.fields.id,
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
