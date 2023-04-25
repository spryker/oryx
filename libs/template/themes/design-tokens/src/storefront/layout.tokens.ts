import { ThemeToken } from '@spryker-oryx/core';

export const layoutTokens: ThemeToken = {
  layout: {
    cols: '12',
    factor: '3',
    column: {
      two: {
        span: '7',
        gap: '30px',
      },
    },
  },
};

export const layoutMdTokens: ThemeToken = {
  layout: {
    container: {
      padding: '30px',
    },
    cols: '8',
    factor: '4',
    column: {
      two: {
        span: '5',
        gap: '20px',
      },
    },
  },
};

export const layoutSmTokens: ThemeToken = {
  layout: {
    container: {
      padding: '10px',
    },
    cols: '4',
    factor: '2',
    column: {
      two: {
        span: '4',
      },
    },
  },
};
