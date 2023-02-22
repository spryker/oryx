import { componentDef } from '@spryker-oryx/core';
import { SearchBoxOptions } from './box.model';

declare global {
  interface FeatureOptions {
    'search-box'?: SearchBoxOptions;
  }
}

export const searchBoxComponent = componentDef({
  name: 'search-box',
  impl: () => import('./box.component').then((m) => m.SearchBoxComponent),
  stylesheets: [
    {
      rules: () =>
        import('./styles').then((m) => [
          ...m.screenStyles,
          ...m.searchboxScreenStyles,
        ]),
    },
  ],
  schema: () => import('./box.schema').then((m) => m.searchBoxComponentSchema),
});
