import { componentDef } from '@spryker-oryx/core';

export const filterButtonComponent = componentDef({
  name: 'oryx-picking-filter-button',
  impl: () =>
    import('./filter-button.component').then((m) => m.FilterButtonComponent),
  schema: () =>
    import('./filter-button.schema').then((m) => m.filterButtonComponentSchema),
});
