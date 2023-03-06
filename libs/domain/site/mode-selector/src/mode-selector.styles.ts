import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

const smallScreen = css`
  :host {
    width: 59px;
  }
`;

export const cartSummaryScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
];

export const styles = css`
  :host {
    width: 50px;
  }

  button {
    color: var(--oryx-color-canvas-100);
  }

  button:hover {
    background-color: var(--oryx-color-primary-400);
    box-shadow: none;
  }

  button:focus-visible {
    outline: solid 1px blue;
  }
`;
