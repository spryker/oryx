import { componentDef } from '@spryker-oryx/core';

export const paginationComponent = componentDef({
  name: 'oryx-pagination',
  impl: () =>
    import('./pagination.component').then((m) => m.PaginationComponent),
});
