import { componentDef, featureVersion } from '@spryker-oryx/utilities';

export const headingComponent = componentDef({
  name: 'oryx-heading',
  impl: () => import('./heading.component').then((m) => m.HeadingComponent),
  stylesheets: [
    {
      rules: () =>
        featureVersion >= '1.4'
          ? import('./heading.styles').then((m) => m.headingScreenStyles)
          : import('./styles/screen.styles').then(
              (m) => m.headlineScreenStyles
            ),
    },
  ],
});
