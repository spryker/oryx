import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

const mediumScreen = css`
  :host {
    --oryx-icon-size: 32px;

    width: 75px;
    height: 68px;
    border-radius: 4px;
  }

  .subtitle {
    text-align: center;
    display: block;
    margin-top: 4px;
    text-transform: uppercase;
  }

  a {
    padding: 8px;
  }

  mark {
    top: 8px;
    inset-inline-end: 10px;
  }
`;

const smallScreen = css`
  :host {
    width: 59px;
    height: 42px;
  }

  .subtitle {
    display: none;
  }

  a {
    padding: 9px;
  }

  mark {
    top: 0;
  }
`;

export const cartSummaryScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
  {
    media: smScreen,
    css: smallScreen,
  },
];

export const styles = css`
  :host {
    --color: 'primary';

    display: block;
    box-sizing: border-box;
    position: relative;
    color: var(--oryx-color-canvas-100);
    background: var(--oryx-color-primary-300);
    flex-shrink: 0;
  }

  :host(:hover) {
    background: var(--oryx-color-primary-400);
  }

  :host(:active) {
    background: var(--oryx-color-primary-500);
  }

  a {
    display: flex;
    flex-direction: column;
    color: inherit;
    text-decoration: none;
    border-radius: inherit;
    outline: none;
  }

  a:focus:focus-visible {
    border: solid 1px #fff;
  }

  mark {
    position: absolute;
    inset-inline-end: 0;
    height: 18px;
    min-width: 6px;
    padding: 1px 6px;
    border-radius: 2px;
    text-align: center;
    background: var(--oryx-color-secondary-300);
    color: var(--oryx-color-neutral-500);
  }
`;
