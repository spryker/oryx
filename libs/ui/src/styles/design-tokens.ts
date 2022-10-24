import { DesignToken } from '@spryker-oryx/core';

const tokens: DesignToken[] = [
  {
    color: {
      brand2: '#17b997',
      ink: '#000000',
    },
    sizes: {
      brand: {
        sm: '100px',
        lg: '140px',
      },
      lg: '300px',
    },
    fonts: {
      lh: {
        brand: {
          sm: '1px',
          'one-more-level': {
            xsm: '0.5px',
          },
        },
        md: '2px',
      },
      lg: '3px',
    },
    'one-line': '140px',
  },
  {
    mediaQuery: {
      mode: 'dark',
    },
    color: {
      brand: 'red',
      brand2: {
        100: '#17c497',
        200: '#17b997',
        300: 'red',
        400: '#17b486',
        500: '#17b476',
      },
      ink: '#ffffff',
    },
  },
];

export default tokens;
