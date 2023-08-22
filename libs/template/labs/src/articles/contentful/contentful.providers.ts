import { ContentAdapter } from '@spryker-oryx/content';
import { Provider } from '@spryker-oryx/di';
import { SuggestionAdapter } from '@spryker-oryx/search';
import { DefaultContentfulSuggestionAdapter } from './contentful-suggestion.adapter';
import { ContentfulContentAdapter } from './contentful.adapter';

export const contentfulProviders: Provider[] = [
  {
    provide: ContentAdapter,
    useClass: ContentfulContentAdapter,
  },
  {
    provide: SuggestionAdapter,
    useClass: DefaultContentfulSuggestionAdapter,
  },
];
