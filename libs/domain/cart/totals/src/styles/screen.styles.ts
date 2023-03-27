import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { lgScreen, mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

const smallScreen = css`
  .summary h4 {
    font-size: var(--oryx-typography-h3-size);
    font-weight: var(--oryx-typography-h3-weight);
    line-height: var(--oryx-typography-h3-line);
  }

  .summary .price-total {
    font-size: var(--oryx-typography-h1-size);
    font-weight: var(--oryx-typography-h1-weight);
    line-height: var(--oryx-typography-h1-line);
  }

  .summary .tax-message {
    font-size: var(--oryx-typography-h4-size);
    font-weight: var(--oryx-typography-h4-weight);
    line-height: var(--oryx-typography-h4-line);
    color: var(--oryx-color-neutral-300);
  }
`;

const mediumPlusScreen = css`
  .summary h4 {
    font-size: var(--oryx-typography-h5-size);
    font-weight: var(--oryx-typography-h5-weight);
    line-height: var(--oryx-typography-h5-line);
  }

  .summary .price-total {
    font-size: var(--oryx-typography-h3-size);
    font-weight: var(--oryx-typography-h3-weight);
    line-height: var(--oryx-typography-h3-line);
  }

  .summary .tax-message {
    font-size: var(--oryx-typography-h6-size);
    font-weight: var(--oryx-typography-h6-weight);
    line-height: var(--oryx-typography-h6-line);
    color: var(--oryx-color-neutral-300);
  }
`;

export const cartTotalsScreenStyles: ThemeStylesWithMedia[] = [
  { media: smScreen, css: smallScreen },
  { media: mdScreen, css: mediumPlusScreen },
  { media: lgScreen, css: mediumPlusScreen },
];
