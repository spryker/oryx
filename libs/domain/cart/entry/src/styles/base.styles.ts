import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: block;
    position: relative;
    line-height: 22px;
  }

  oryx-icon-button {
    position: absolute;
    inset-block-start: var(--oryx-space-4);
    inset-inline-end: var(--oryx-space-4);
  }

  .entry {
    display: flex;
    flex-direction: column;
    padding-inline: var(--oryx-space-4);
    padding-block-start: var(--oryx-space-4);
  }

  section {
    flex: 1 1 auto;
  }

  oryx-product-media {
    display: flex;
    width: 80px;
    height: 80px;
    margin-block-end: var(--oryx-space-2);
    align-self: center;
  }
`;

const mediumScreen = css`
  .entry {
    flex-direction: row;
    align-items: flex-start;
  }

  oryx-product-media {
    margin-block-end: 0;
    margin-inline-end: var(--oryx-space-4);
    width: 100px;
    height: 100px;
    align-self: inherit;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
];
