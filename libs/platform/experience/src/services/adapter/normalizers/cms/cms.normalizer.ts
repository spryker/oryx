import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ApiExperienceCmsModel, Component } from '../../../../models';

export const CmsNormalizer = 'oryx.CmsNormalizer*';

export function cmsItemsNormalizer(
  data: ApiExperienceCmsModel.Response
): Component[] {
  return data.items.map((item) => ({
    ...item.fields.data,
    id: item.fields.id,
  }));
}

export const productNormalizer: Provider[] = [
  {
    provide: CmsNormalizer,
    useValue: cmsItemsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CmsNormalizer]: Transformer<Component[]>;
  }
}
