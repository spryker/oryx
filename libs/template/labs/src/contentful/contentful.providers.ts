import { ContentAdapter } from '@spryker-oryx/content';
import { Provider } from '@spryker-oryx/di';
import { ContentfulAdapter } from './contentful.adapter';

export const contentfulProviders: Provider[] = [
  {
    provide: ContentAdapter,
    useClass: ContentfulAdapter,
  },
];
