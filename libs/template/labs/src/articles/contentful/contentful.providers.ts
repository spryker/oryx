import { ContentAdapter } from '@spryker-oryx/content';
import { Provider } from '@spryker-oryx/di';
import { CmsNormalizer } from '@spryker-oryx/experience';
import { SuggestionAdapter } from '@spryker-oryx/search';
import {
  DefaultContentfulSuggestionAdapter,
  cmsSuggestionNormalizer,
} from './contentful-suggestion.adapter';
import {
  ContentfulContentAdapter,
  cmsContentNormalizer,
} from './contentful.adapter';

export const contentfulProviders: Provider[] = [
  {
    provide: ContentAdapter,
    useClass: ContentfulContentAdapter,
  },
  {
    provide: SuggestionAdapter,
    useClass: DefaultContentfulSuggestionAdapter,
  },
  {
    provide: CmsNormalizer,
    useValue: cmsContentNormalizer,
  },
  {
    provide: CmsNormalizer,
    useValue: cmsSuggestionNormalizer,
  },
];
