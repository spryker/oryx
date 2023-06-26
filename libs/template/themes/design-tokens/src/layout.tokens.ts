import { ThemeToken } from '@spryker-oryx/experience';

export const layoutTokens: ThemeToken = {
  container: { width: '1340px', bleed: '50px' },

  modal: {
    width: '510px',
    bleed: '30px',
  },

  column: {
    base: '12',
    gap: '20px',
    grid: '4',
    split: { equal: '6', aside: '3', main: '8' },
  },
  row: { gap: '10px' },
  divider: { width: '1px' },
};

export const layoutMdTokens: ThemeToken = {
  container: { bleed: '30px' },
  column: {
    base: '8',
    grid: '3',
    split: { equal: '4', aside: '2.66', main: '5' },
  },
};

export const layoutSmTokens: ThemeToken = {
  container: { bleed: '0px' },
  modal: {
    width: '100vw',
    bleed: '0px',
    'max-width': '100vw',
    radius: '0px',
    height: '100vh',
  },
  column: {
    base: '4',
    grid: '2',
  },
};
