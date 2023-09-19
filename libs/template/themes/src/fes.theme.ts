import { Theme } from '@spryker-oryx/experience';
import { backofficeIcons, fontawesomeIcons } from '@spryker-oryx/resources';
import { defaultBreakpoints } from '@spryker-oryx/themes/breakpoints';

export const fesTheme: Theme = {
  name: 'fes',
  breakpoints: defaultBreakpoints,
  designTokens: () =>
    import('../design-tokens/src/backoffice').then((s) => s.backofficeTokens),
  icons: {
    resource: fontawesomeIcons,
    resources: [
      {
        resource: backofficeIcons,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        types: Object.keys(backofficeIcons.mapping!),
      },
    ],
  },
};
