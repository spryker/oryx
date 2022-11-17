import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const optionsBaseStyles = css`
  :host {
    display: block;
  }

  :host(:not([show-options])) ul {
    display: none;
  }

  :host > span {
    display: flex;
    align-items: center;
    padding-block: var(--oryx-space-2);
    border-block-start: 2px solid var(--oryx-color-neutral-greyblue);
  }

  oryx-button {
    --_color-text: var(--oryx-color-brand);

    margin-inline-start: var(--oryx-space-2);
  }

  ul {
    margin: 0;
    padding-block-end: var(--oryx-space-2);
    padding-inline: 0;
    list-style: none;
  }

  li {
    display: flex;
    justify-content: space-between;
  }

  li:not(:last-child) {
    margin-bottom: var(--oryx-space);
  }

  li span {
    margin-inline-end: var(--oryx-space);
  }
`;

const mediumScreen = css`
  :host {
    margin-inline-end: calc(-1 * var(--oryx-space-4));
  }

  ul {
    padding-inline-end: var(--oryx-space-4);
  }
`;

export const optionsScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
];
