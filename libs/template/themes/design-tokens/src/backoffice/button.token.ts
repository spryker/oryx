import { DesignToken } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/utilities';

export const buttonTokens: DesignToken[] = [
  {
    button: {
      lg: {
        height: '48px',
        'padding-inline': '27px',
        icon: {
          size: '16px',
        },
      },
      md: {
        height: '42px',
        'padding-inline': '20px',
        icon: {
          size: '16px',
        },
      },
      sm: {
        height: '38px',
        'padding-inline': '16px',
      },
      border: {
        radius: '10px',
      },
      icon: {
        'padding-inline': '16px',
        sm: '13.3px',
        md: '13.3px',
        lg: '13.3px',
      },
    },
  },
  {
    media: {
      screen: Size.Sm,
    },
    button: {
      sm: { height: '48px', 'icon-size': '20px' },
      md: { height: '48px' },
    },
  },
];
