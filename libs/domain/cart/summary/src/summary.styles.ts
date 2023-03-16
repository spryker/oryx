import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

const smallScreen = css`
  :host,
  oryx-menu-item-button {
    min-width: 59px;
  }

  mark {
    inset-block-start: 2px;
    inset-inline-end: 2px;
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
    position: relative;
  }

  mark {
    position: absolute;
    line-height: 16px;
    min-width: 6px;
    padding: 1px 6px;
    border-radius: 2px;
    text-align: center;
    background: var(--oryx-color-secondary-300);
    color: var(--oryx-color-neutral-500);
    inset-block-start: 6px;
    inset-inline-end: 8px;
  }
`;
