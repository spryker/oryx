import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ApiExperienceCmsModel, ExperienceCms } from '../../../../models';

export const CmsNormalizer = 'oryx.CmsNormalizer*';

export function cmsItemsNormalizer(
  data: ApiExperienceCmsModel.Model
): ExperienceCms {
  if (data.qualifier.type === 'page') {
    return {
      pages: data.data.items.map((item) => ({
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
