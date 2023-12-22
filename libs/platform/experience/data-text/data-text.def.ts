import { componentDef } from '@spryker-oryx/utilities';
import { DataTextComponentOptions } from './data-text.model';

declare global {
  interface FeatureOptions {
    'oryx-data-text'?: DataTextComponentOptions;
  }
}

export const dataText = componentDef({
  name: 'oryx-data-text',
  impl: () => import('./data-text.component').then((m) => m.DataTextComponent),
  schema: () => import('./data-text.schema').then((m) => m.dataTextSchema),
});
