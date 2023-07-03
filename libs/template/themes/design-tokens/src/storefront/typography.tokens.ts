import { ThemeToken } from '@spryker-oryx/experience';

export const typographyTokens: ThemeToken = {
  typography: {
    font: {
      face: `'Montserrat', sans-serif`,
      size: '14px',
      weight: '500',
      line: '22px',
    },
  },
};

export const typographySmallTokens: ThemeToken = {
  typography: {
    h1: { size: '1.572em', line: '1.364em', weight: '600', align: 'center' },
    h2: { size: '1.286em', line: '1.44em', weight: '700' },
    h3: { size: '1.143em', line: '1.375em', weight: '600' },
    h4: { size: '1em', line: '1.572em', weight: '600' },
    h5: { size: '1em', line: '1.572em', weight: '700' },
    h6: { size: '0.857em', line: '1.333em', weight: '600' },
    subtitle: { size: '0.857em', line: '1.333em', weight: '600' },
    'subtitle-small': { size: '0.857em', line: '1.333em', weight: '600' },
    caption: { size: '0.857em', line: '1.333em', weight: '600' },
    small: { size: '0.857em', line: '1.333em', weight: '500' },
    bold: { size: '1.1428571429em', line: '1em', weight: '600' },
  },
};

export const typographyMediumAndLargerTokens: ThemeToken = {
  typography: {
    h1: { size: '2.857em', line: '1.2em', weight: '600' },
    h2: { size: '2.143em', line: '1.2em', weight: '600' },
    h3: { size: '1.572em', line: '1.364em', weight: '500' },
    h4: { size: '1.286em', line: '1.444em', weight: '500' },
    h5: { size: '1.143em', line: '1.5em', weight: '600' },
    h6: { size: '1.143em', line: '1.5em', weight: '500' },
    subtitle: { size: '0.857em', line: '1.333em', weight: '600' },
    'subtitle-small': { size: '0.857em', line: '1.333em', weight: '600' },
    caption: { size: '0.857em', line: '1.333em', weight: '600' },
    small: { size: '0.857em', line: '1.333em', weight: '500' },
    bold: { weight: '600' },
  },
};
