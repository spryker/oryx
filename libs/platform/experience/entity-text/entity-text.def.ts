import { componentDef } from '@spryker-oryx/utilities';
import { EntityTextOptions } from './entity-text.model';

declare global {
  interface FeatureOptions {
    'oryx-entity-text'?: EntityTextOptions;
  }
}

export const entityText = componentDef({
  name: 'oryx-entity-text',
  impl: () =>
    import('./entity-text.component').then((m) => m.EntityTextComponent),
  schema: () => import('./entity-text.schema').then((m) => m.entityTextSchema),
});