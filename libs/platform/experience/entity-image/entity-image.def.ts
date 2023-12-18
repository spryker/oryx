import { componentDef } from '@spryker-oryx/utilities';
import { EntityImageOptions } from './entity-image.model';

declare global {
  interface FeatureOptions {
    'oryx-entity-image'?: EntityImageOptions;
  }
}

export const entityImage = componentDef({
  name: 'oryx-entity-image',
  impl: () =>
    import('./entity-image.component').then((m) => m.EntityImageComponent),
  schema: () =>
    import('./entity-image.schema').then((m) => m.entityImageSchema),
});
