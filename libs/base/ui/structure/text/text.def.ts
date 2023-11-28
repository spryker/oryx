import { componentDef, featureVersion } from '@spryker-oryx/utilities';

export const textComponent = componentDef({
  name: 'oryx-text',
  impl: () => import('./text.component').then((m) => m.TextComponent),
  stylesheets:
    featureVersion >= '1.4'
      ? []
      : [
          {
            rules: () =>
              import('../heading/src/heading.styles').then(
                (m) => m.headingStyles
              ),
          },
        ],
});
