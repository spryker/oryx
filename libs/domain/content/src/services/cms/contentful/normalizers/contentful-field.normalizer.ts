import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { marked } from 'marked';
import { ContentfulAssets } from '../contentful.model';

export interface ContentfulContentField {
  type: string;
  key: string;
  value: unknown;
  assets?: Record<string, ContentfulAssets>;
}

export interface ContentfulLinkAsset {
  sys: {
    id: string;
    linkType: string;
    type: string;
  };
}

export const ContentfulFieldNormalizer = 'oryx.ContentfulFieldNormalizer*';

export function contentfulFieldNormalizer(
  data: ContentfulContentField
): ContentfulContentField {
  if (data.type === 'Text') {
    return {
      ...data,
      value: marked.parse(data.value as string),
    };
  }

  if (isAsset(data.type, data.value)) {
    return {
      ...data,
      value: data.assets?.[data.value.sys.id],
    };
  }

  return data;
}

const isAsset = (typ: string, value: unknown): value is ContentfulLinkAsset => {
  return (
    typ === 'Link' && (value as ContentfulLinkAsset).sys.linkType === 'Asset'
  );
};

export const contentfulFieldNormalizers: Provider[] = [
  {
    provide: ContentfulFieldNormalizer,
    useValue: contentfulFieldNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ContentfulFieldNormalizer]: Transformer<ContentfulContentField>;
  }
}
