import { componentDef } from '@spryker-oryx/core';

export const headingComponent = componentDef({
  name: 'oryx-heading',
  impl: () => import('./heading.component').then((m) => m.HeadingComponent),
  stylesheets: [
    {
      rules: () =>
        import('./styles/screen.styles').then((m) => m.headlineScreenStyles),
    },
  ],
});
