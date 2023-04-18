import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { DirectionalityPageMetaResolver } from './resolvers';

export const applicationProviders: Provider[] = [
  {
    provide: PageMetaResolver,
    useClass:  DirectionalityPageMetaResolver,
  },
];
