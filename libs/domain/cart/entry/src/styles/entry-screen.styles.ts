import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

const smallScreen = css`
  :host {
    padding-block: 0;
  }

  oryx-product-media,
  .details {
    margin-block-start: 16px;
  }

  .price {
    grid-column: 2;
    grid-row: 2;
    justify-items: start;
  }

  oryx-product-media {
    width: 74px;
    margin-inline-start: 16px;
  }

  oryx-cart-quantity-input {
    margin-block: 18px;
  }

  .actions {
    grid-column: 1 / span 3;
    grid-row: 3;
    background: var(--oryx-color-canvas-200);
    padding: 16px;
    margin-block-start: 20px;
  }

  :host(:first-of-type) {
    border-top: 1px solid var(--oryx-color-canvas-300);
  }
`;

export const cartEntryScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
];
