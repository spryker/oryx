import { componentDef } from '@spryker-oryx/utilities';
import { DataImageComponentOptions } from './data-image.model';

declare global {
  interface FeatureOptions {
    'oryx-data-image'?: DataImageComponentOptions;
  }
}

export const dataImage = componentDef({
  name: 'oryx-data-image',
  impl: () =>
    import('./data-image.component').then((m) => m.DataImageComponent),
  schema: () => import('./data-image.schema').then((m) => m.dataImageSchema),
});
