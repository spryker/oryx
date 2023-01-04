import { componentDef } from '@spryker-oryx/core';

export const experienceCompositionComponent = componentDef({
  name: 'experience-composition',
  impl: () =>
    import('./experience-composition.component').then(
      (m) => m.ExperienceCompositionComponent
    ),
  stylesheets: [
    {
      rules: () => import('./style').then((m) => m.layoutScreenStyles),
    },
  ],
});

export const experiencePreviewCompositionComponent = componentDef({
  name: 'experience-composition',
  impl: () =>
    import('./experience-composition-preview.component').then(
      (m) => m.ExperienceCompositionPreviewComponent
    ),
  stylesheets: [
    {
      rules: () => import('./style').then((m) => m.layoutScreenStyles),
    },
  ],
});
