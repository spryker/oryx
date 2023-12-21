import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ContentAsset } from '@spryker-oryx/experience';
import { ContentfulCmsModel } from '../contentful.api.model';

export const ContentfulAssetsNormalizer = 'oryx.ContentfulAssetsNormalizer*';

export function contentfulAssetsNormalizer({
  data,
  locale,
}: {
  data: ContentfulCmsModel.AssetsResponse;
  locale: string;
}): Record<string, ContentAsset> {
  return data.items.reduce((acc, asset) => {
    const file =
      (asset.fields.file as Record<string, ContentfulCmsModel.File>)?.[
        locale
      ] ?? asset.fields.file;

    return {
      ...acc,
      [asset.sys.id]: {
        src: file?.url,
        alt: asset.fields.title,
        caption: asset.fields.description,
      } as ContentAsset,
    };
  }, {}) as Record<string, ContentAsset>;
}

export const contentfulAssetsNormalizers: Provider[] = [
  {
    provide: ContentfulAssetsNormalizer,
    useValue: contentfulAssetsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ContentfulAssetsNormalizer]: Transformer<Record<string, ContentAsset>>;
  }
}
