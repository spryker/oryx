import { ThemeToken } from '@spryker-oryx/experience';

export const typographyTokens: ThemeToken = {
  typography: {
    body: { font: `'Montserrat', sans-serif`, weight: '500', line: '22px' },
  },
};

export const typographySmallTokens: ThemeToken = {
  typography: {
    h1: { size: '1.572rem', line: '1.364em', weight: '600', align: 'center' },
    h2: { size: '1.286rem', line: '1.44em', weight: '700' },
    h3: { size: '1.143rem', line: '1.375em', weight: '600' },
    h4: { size: '1rem', line: '1.572em', weight: '600' },
    h5: { size: '1rem', line: '1.572em', weight: '700' },
    h6: { size: '0.857rem', line: '1.333em', weight: '600' },
    subtitle: { size: '0.857rem', line: '1.333em', weight: '600' },
    'subtitle-small': { size: '0.857rem', line: '1.333em', weight: '600' },
    caption: { size: '0.857rem', line: '1.333em', weight: '600' },
    small: { size: '0.857rem', line: '1.333em', weight: '500' },
    bold: { size: '1.1428571429rem', line: '1em', weight: '600' },
  },
};

export const typographyMediumAndLargerTokens: ThemeToken = {
  typography: {
    h1: { size: '2.857rem', line: '1.2em', weight: '600' },
    h2: { size: '2.143rem', line: '1.2em', weight: '600' },
    h3: { size: '1.572rem', line: '1.364em', weight: '500' },
    h4: { size: '1.286rem', line: '1.444em', weight: '500' },
    h5: { size: '1.143rem', line: '1.5em', weight: '600' },
    h6: { size: '1.143rem', line: '1.5em', weight: '500' },
    subtitle: { size: '0.857rem', line: '1.333em', weight: '600' },
    'subtitle-small': { size: '0.857rem', line: '1.333em', weight: '600' },
    caption: { size: '0.857rem', line: '1.333em', weight: '600' },
    small: { size: '0.857rem', line: '1.333em', weight: '500' },
    bold: { size: '1rem', weight: '600' },
  },
};
