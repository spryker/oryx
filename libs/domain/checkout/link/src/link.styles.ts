import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const styles = css`
  :host {
    display: contents;
  }
`;

const smallScreen = css`
  :host {
    display: block;
    position: sticky;
    inset-block-end: 0;
    padding: 10px;
    background: var(--oryx-color-canvas-100);
  }
`;

export const checkoutLinkScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
];
