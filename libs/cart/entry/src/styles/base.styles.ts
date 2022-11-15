import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/theme/breakpoints';
import { css } from 'lit';

export const baseStyles = css`
  :host {
    display: block;
    position: relative;
    line-height: 22px;
  }

  oryx-icon-button {
    position: absolute;
    top: var(--oryx-space-2);
    inset-inline-end: var(--oryx-space-2);
  }

  oryx-icon-button oryx-icon {
    --oryx-icon-size: var(--oryx-icon-size-small);
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

  product-media {
    display: flex;
    width: 80px;
    height: 80px;
    margin-bottom: var(--oryx-space-2);
    align-self: center;
  }
`;

const mediumScreen = css`
  .entry {
    flex-direction: row;
    align-items: flex-start;
  }

  product-media {
    margin-bottom: 0;
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
