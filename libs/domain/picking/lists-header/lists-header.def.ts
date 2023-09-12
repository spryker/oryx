import { componentDef } from '@spryker-oryx/utilities';

export const listsHeaderComponent = componentDef({
  name: 'oryx-picking-lists-header',
  impl: () =>
    import('./lists-header.component').then((m) => m.ListsHeaderComponent),
});
