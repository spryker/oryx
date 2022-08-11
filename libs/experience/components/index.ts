import { componentDef } from '@spryker-oryx/core';
export * from './experience-composition-preview.component';
export * from './experience-composition.component';

export const experienceCompositionComponent = componentDef({
  name: 'experience-composition',
  impl: () =>
    new URLSearchParams(new URL(window.location.href).search).has('ebPreview')
      ? import('./experience-composition-preview.component').then(
          (m) => m.ExperienceCompositionPreviewComponent
        )
      : import('./experience-composition.component').then(
          (m) => m.ExperienceCompositionComponent
        ),
});
