import { ThemeToken } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';

export const typographyTokens: ThemeToken = {
  typography: {
    body: { font: `'Montserrat', sans-serif`, weight: '500', line: '22px' },
    subtitle: {
      size: '0.8571428571rem',
      line: '1.3333333333em',
      weight: '600',
    },
    'subtitle-small': {
      size: '0.8571428571rem',
      line: '1.3333333333em',
      weight: '600',
    },
    small: { size: '0.8571428571rem', line: '1.3333333333em', weight: '500' },
    caption: { size: '0.8571428571rem', line: '1.3333333333em', weight: '600' },
  },
};

const smallStrongTypographyToken: ThemeToken =
  featureVersion <= '1.3'
    ? { bold: { size: '1.1428571429rem', line: '1em', weight: '600' } }
    : { strong: { size: '1.1428571429rem', weight: '600', line: '1em' } };

export const typographySmallTokens: ThemeToken = {
  typography: {
    h1: {
      size: '1.5714285714rem',
      line: '1.3636363636em',
      weight: '600',
      align: 'center',
    },
    h2: { size: '1.2857142857rem', line: '1.4444444444em', weight: '700' },
    h3: { size: '1.1428571429rem', line: '1.375em', weight: '600' },
    h4: { size: '1rem', line: '1.5714285714em', weight: '600' },
    h5: { size: '1rem', line: '1.5714285714em', weight: '700' },
    h6: { size: '0.8571428571rem', line: '1.3333333333em', weight: '600' },
    ...smallStrongTypographyToken,
  },
};

const mediumStrongTypographyToken: ThemeToken =
  featureVersion <= '1.3'
    ? { bold: { size: '1rem', weight: '600' } }
    : { strong: { size: '1rem', weight: '600' } };

export const typographyMediumAndLargerTokens: ThemeToken = {
  typography: {
    h1: { size: '2.8571428571rem', line: '1.2em', weight: '600' },
    h2: { size: '2.142857142857143rem', line: '1.2em', weight: '600' },
    h3: { size: '1.5714285714rem', line: '1.3636363636em', weight: '500' },
    h4: { size: '1.2857142857rem', line: '1.4444444444em', weight: '500' },
    h5: { size: '1.1428571429rem', line: '1.5em', weight: '600' },
    h6: { size: '1.1428571429rem', line: '1.5em', weight: '500' },
    strong: { size: '1rem', weight: '600' },
    ...mediumStrongTypographyToken,
  },
};
