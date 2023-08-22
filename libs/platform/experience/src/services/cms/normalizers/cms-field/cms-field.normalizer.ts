import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { marked } from 'marked';

interface ContentLocalField {
  type: string;
  key: string;
  value: string;
}

export const CmsFieldNormalizer = 'oryx.CmsFieldNormalizer*';

export function fieldNormalizer(data: ContentLocalField): ContentLocalField {
  if (data.type === 'Text') {
    return {
      ...data,
      value: marked.parse(data.value),
    };
  }

  return data;
}

export const cmsFieldNormalizers: Provider[] = [
  {
    provide: CmsFieldNormalizer,
    useValue: fieldNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [CmsFieldNormalizer]: Transformer<ContentLocalField>;
  }
}
