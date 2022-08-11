import { componentDef } from '@spryker-oryx/core';

export * from './controllers';
export * from './typeahead.component';
export * from './typeahead.model';
export * from './typeahead.styles';

export const typeheadComponent = componentDef({
  name: 'oryx-typeahead',
  impl: () => import('./typeahead.component').then((m) => m.TypeaheadComponent),
});
