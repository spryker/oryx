import { componentDef } from '@spryker-oryx/core';

export const paginationComponent = componentDef({
  name: 'oryx-search-pagination',
  impl: () =>
    import('./pagination.component').then((m) => m.PaginationComponent),
});
