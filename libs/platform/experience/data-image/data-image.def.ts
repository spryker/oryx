import { componentDef } from '@spryker-oryx/utilities';
import { DataImageOptions } from './data-image.model';

declare global {
  interface FeatureOptions {
    'oryx-data-image'?: DataImageOptions;
  }
}

export const dataImage = componentDef({
  name: 'oryx-data-image',
  impl: () =>
    import('./data-image.component').then((m) => m.DataImageComponent),
  schema: () => import('./data-image.schema').then((m) => m.dataImageSchema),
});
