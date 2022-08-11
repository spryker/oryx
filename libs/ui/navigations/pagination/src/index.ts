import { componentDef } from '@spryker-oryx/core';

export * from './pagination.component';
export * from './pagination.controller';
export * from './pagination.model';
export * from './pagination.styles';

export const paginationComponent = componentDef({
  name: 'oryx-pagination',
  impl: () =>
    import('./pagination.component').then((m) => m.PaginationComponent),
});
