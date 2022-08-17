import { componentDef } from '@spryker-oryx/core';

export const typeheadComponent = componentDef({
  name: 'oryx-typeahead',
  impl: () => import('./typeahead.component').then((m) => m.TypeaheadComponent),
});
