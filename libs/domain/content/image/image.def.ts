import { componentDef } from '@spryker-oryx/utilities';

export const contentImageComponent = componentDef({
  name: 'oryx-content-image',
  impl: () => import('./image.component').then((m) => m.ContentImageComponent),
  schema: () =>
    import('./image.schema').then((m) => m.contentImageComponentSchema),
});
