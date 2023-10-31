import { Theme } from '@spryker-oryx/experience';
import { fulfillmentIcons, materialDesignIcons } from '@spryker-oryx/resources';
import { Size } from '@spryker-oryx/utilities';

export const fulfillmentTheme: Theme = {
  name: 'fulfillment',
  breakpoints: {
    [Size.Sm]: {
      max: 530,
    },
    [Size.Md]: {
      min: 531,
      max: 1023,
    },
  },
  designTokens: () =>
    import('../design-tokens/src/mobile-backoffice').then(
      (s) => s.mobileBackofficeTokens
    ),
  icons: {
    resource: materialDesignIcons,
    resources: [
      {
        resource: fulfillmentIcons,
        types: Object.keys(fulfillmentIcons.mapping ?? {}),
      },
      {
        resource: {
          id: 'material-icons',
          styles: {
            fill: 1,
          },
        },
        types: ['person'],
      },
    ],
  },
};
