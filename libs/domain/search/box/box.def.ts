import { componentDef } from '@spryker-oryx/core';
import { SearchBoxOptions } from './box.model';

declare global {
  interface FeatureOptions {
    'oryx-search-box'?: SearchBoxOptions;
  }
}

export const searchBoxComponent = componentDef({
  name: 'oryx-search-box',
  impl: () => import('./box.component').then((m) => m.SearchBoxComponent),
  stylesheets: [
    {
      rules: () => import('./box.styles').then((m) => [...m.screenStyles]),
    },
  ],
  schema: () => import('./box.schema').then((m) => m.searchBoxComponentSchema),
});
