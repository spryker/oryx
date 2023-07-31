import { componentDef } from '@spryker-oryx/utilities';

export const compositionComponent = componentDef({
  name: 'oryx-composition',
  impl: () =>
    import('./composition.component').then((m) => m.CompositionComponent),
});

export const previewCompositionComponent = componentDef({
  name: 'oryx-composition',
  impl: () =>
    import('./composition-preview.component').then(
      (m) => m.CompositionPreviewComponent
    ),
  schema: () => import('./composition.schema').then((m) => m.compositionSchema),
});
