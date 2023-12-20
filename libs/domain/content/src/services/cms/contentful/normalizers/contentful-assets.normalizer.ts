import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ContentfulCmsModel } from '../contentful.api.model';
import { ContentfulAssets } from '../contentful.model';

export const ContentfulAssetsNormalizer = 'oryx.ContentfulAssetsNormalizer*';

export function contentfulAssetsNormalizer({
  data,
  locale,
}: {
  data: ContentfulCmsModel.AssetsResponse;
  locale: string;
}): Record<string, ContentfulAssets> {
  return data.items.reduce((acc, asset) => {
    const file =
      (asset.fields.file as Record<string, ContentfulCmsModel.File>)?.[
        locale
      ] ?? asset.fields.file;

    return {
      ...acc,
      [asset.sys.id]: {
        description: asset.fields.description,
        title: asset.fields.title,
        url: file?.url,
      },
    };
  }, {}) as Record<string, ContentfulAssets>;
}

export const contentfulAssetsNormalizers: Provider[] = [
  {
    provide: ContentfulAssetsNormalizer,
    useValue: contentfulAssetsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ContentfulAssetsNormalizer]: Transformer<Record<string, ContentfulAssets>>;
  }
}
