import { componentDef } from '@spryker-oryx/core';

export const searchComponent = componentDef({
  name: 'oryx-search',
  impl: () => import('./search.component').then((m) => m.SearchComponent),
  stylesheets: [
    {
      rules: () => import('./search.styles').then((m) => m.searchScreenStyles),
    },
  ],
});
