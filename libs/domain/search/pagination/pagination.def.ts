import { componentDef } from '@spryker-oryx/utilities';
import { SearchPaginationOptions } from './pagination.model';

declare global {
  interface FeatureOptions {
    'oryx-search-pagination'?: SearchPaginationOptions;
  }
}

export const searchPaginationComponent = componentDef({
  name: 'oryx-search-pagination',
  impl: () =>
    import('./pagination.component').then((m) => m.SearchPaginationComponent),
  schema: () =>
    import('./pagination.schema').then(
      (m) => m.searchPaginationComponentSchema
    ),
});
