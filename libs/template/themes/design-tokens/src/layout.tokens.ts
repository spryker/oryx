import { ThemeToken } from '@spryker-oryx/core';

export const layoutTokens: ThemeToken = {
  container: { width: '1340px', bleed: '50px' },
  grid: {
    columns: { base: '12', carousel: '4', grid: '4' },
    gap: { column: '20px', row: '10px' },
  },
};

export const layoutMdTokens: ThemeToken = {
  container: { bleed: '30px' },
  grid: {
    columns: { base: '8', grid: '3', carousel: '3' },
  },
};

export const layoutSmTokens: ThemeToken = {
  container: { bleed: '0px' },
  grid: {
    columns: { base: '4', grid: '2', carousel: '2' },
  },
};
