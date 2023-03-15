import {
  b2cResources,
  b2cTheme,
  backofficeNgResources,
  backofficeNgTheme,
  backofficeResources,
  backofficeTheme,
} from '@spryker-oryx/presets';

export const theme = {
  default: 'backoffice',
  list: {
    b2c: [b2cTheme],
    backoffice: [backofficeTheme],
    'backoffice-ng': [backofficeNgTheme],
  },
};

export const resource = {
  default: 'b2c',
  list: {
    b2c: b2cResources,
    backoffice: backofficeResources,
    'backoffice-ng': backofficeNgResources,
  },
};
