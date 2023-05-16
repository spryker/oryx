import { componentDef } from '@spryker-oryx/core';

export const experienceCompositionComponent = componentDef({
  name: 'experience-composition',
  impl: () =>
    import('./experience-composition.component').then(
      (m) => m.ExperienceCompositionComponent
    ),
});

export const experiencePreviewCompositionComponent = componentDef({
  name: 'experience-composition',
  impl: () =>
    import('./experience-composition-preview.component').then(
      (m) => m.ExperienceCompositionPreviewComponent
    ),
  schema: () =>
    import('./experience-composition.schema').then(
      (m) => m.experienceCompositionSchema
    ),
});
