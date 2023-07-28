import { ThemeToken } from '@spryker-oryx/experience';

export const typographyTokens: ThemeToken = {
  typography: {
    body: { font: '"Montserrat", sans-serif', weight: '500' },
    subtitle: { size: '1rem', line: '1.5714285714em', weight: '500' },
    'subtitle-small': {
      size: '0.8571428571rem',
      line: '1.1428571429rem',
      weight: '400',
    },
    caption: { size: '0.8571428571rem', line: '1.3333333333em', weight: '600' },
    bold: { size: '1rem', weight: '600', line: '1.5714285714rem' },
  },
};

export const typographySmallTokens: ThemeToken = {
  typography: {
    h1: { size: '1.5714285714rem', line: '1.3636363636em', weight: '600' },
    h2: { size: '1.2857142857rem', line: '1.4444444444em', weight: '700' },
    h3: { size: '1.1428571429rem', line: '1.375em', weight: '600' },
    h4: { size: '1rem', line: '1.5714285714em', weight: '600' },
    h5: { size: '1rem', line: '1.5714285714em', weight: '700' },
    h6: { size: '0.8571428571rem', line: '1.3333333333em', weight: '600' },
  },
};

export const typographyMediumAndLargerTokens: ThemeToken = {
  typography: {
    h1: { size: '2.1428571429rem', line: '1.3333333333em', weight: '600' },
    h2: { size: '1.8571428571rem', line: '1.4615384615em', weight: '600' },
    h3: { size: '1.4285714286rem', line: '1.4em', weight: '600' },
    h4: { size: '1.2857142857rem', line: '1.4444444444em', weight: '600' },
    h5: { size: '1.1428571429rem', line: '1.375em', weight: '600' },
    h6: { size: '1.1428571429rem', line: '1.375em', weight: '500' },
  },
};
