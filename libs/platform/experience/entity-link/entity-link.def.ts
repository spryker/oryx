import { componentDef } from '@spryker-oryx/utilities';
import { EntityLinkOptions } from './entity-link.model';

declare global {
  interface FeatureOptions {
    'oryx-entity-link'?: EntityLinkOptions;
  }
}

export const entityLink = componentDef({
  name: 'oryx-entity-link',
  impl: () =>
    import('./entity-link.component').then((m) => m.EntityLinkComponent),
  schema: () => import('./entity-link.schema').then((m) => m.entityLinkSchema),
});
