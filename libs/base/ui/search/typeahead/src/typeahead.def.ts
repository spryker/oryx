import { componentDef } from '@spryker-oryx/utilities';

export const typeheadComponent = componentDef({
  name: 'oryx-typeahead',
  impl: () => import('./typeahead.component').then((m) => m.TypeaheadComponent),
  stylesheets: [
    {
      rules: () => import('./typeahead.styles').then((m) => m.screenStyles),
    },
  ],
});
