import { ThemeToken } from '@spryker-oryx/experience';

export const layoutTokens: ThemeToken = {
  container: { width: '1340px', bleed: '50px' },
  column: {
    base: '12',
    gap: '20px',
    grid: '4',
    split: { equal: '6', aside: '3', main: '8' },
  },
  row: { gap: '10px' },
};

export const layoutMdTokens: ThemeToken = {
  container: { bleed: '30px' },
  column: {
    base: '8',
    grid: '3',
    split: { equal: '4', aside: '2.66', main: '5' },
    // aside seems off! when we combine split column and grid (i.e. on plp)
  },
};

export const layoutSmTokens: ThemeToken = {
  container: { bleed: '0px' },
  column: {
    base: '4',
    grid: '2',
  },
};
