import { componentDef } from '@spryker-oryx/utilities';
import { EntityLinkOptions } from './data-link.model';

declare global {
  interface FeatureOptions {
    'oryx-data-link'?: EntityLinkOptions;
  }
}

export const dataLink = componentDef({
  name: 'oryx-data-link',
  impl: () => import('./data-link.component').then((m) => m.DataLinkComponent),
  schema: () => import('./data-link.schema').then((m) => m.dataLinkSchema),
});
