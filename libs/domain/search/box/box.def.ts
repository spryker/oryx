import { componentDef } from '@spryker-oryx/utilities';
import { SearchBoxOptions } from './box.model';

declare global {
  interface FeatureOptions {
    'oryx-search-box'?: SearchBoxOptions;
  }
}

export const searchBoxComponent = componentDef({
  name: 'oryx-search-box',
  impl: () => import('./box.component').then((m) => m.SearchBoxComponent),
  schema: () => import('./box.schema').then((m) => m.searchBoxComponentSchema),
});
