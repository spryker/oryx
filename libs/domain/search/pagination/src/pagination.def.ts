import { componentDef } from '@spryker-oryx/core';
import { PaginationOptions } from './pagination.model';

declare global {
  interface FeatureOptions {
    'oryx-search-pagination'?: PaginationOptions;
  }
}

export const paginationComponent = componentDef({
  name: 'oryx-search-pagination',
  impl: () =>
    import('./pagination.component').then((m) => m.PaginationComponent),
});
