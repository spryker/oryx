import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const searchboxStyles = css`
  [slot='prefix'] {
    color: var(--oryx-color-neutral-400);
  }

  input::placeholder {
    color: var(--oryx-color-neutral-300);
  }

  input {
    padding-block: 16px;
    height: 56px;
  }

  oryx-button[slot='suffix'] {
    --_color-text: var(--oryx-color-primary-300);
  }

  oryx-icon-button[slot='suffix'] {
    --oryx-icon-button-color: var(--oryx-color-neutral-400);
  }

  oryx-icon-button[slot='suffix'] oryx-icon {
    --oryx-icon-size: 16px;
  }

  [slot='option']::before,
  [slot='option']::after {
    height: 30px;
  }

  [slot='option']::before {
    /* stylelint-disable-next-line */
    background: linear-gradient(180deg, #fff 0, #fff0 100%);
  }

  [slot='option']::after {
    /* stylelint-disable-next-line */
    background: linear-gradient(0deg, #fff 0, #fff0 100%);
  }

  content-link::part(link) {
    padding: 0;
    white-space: normal;
    border-radius: 0;
  }

  .product {
    transition: background var(--oryx-transition-time);
    background: transparent;
    color: var(--oryx-color-neutral-300);
  }

  .product:hover {
    background: var(--oryx-color-canvas-200);
  }

  .product product-title {
    margin-bottom: 4px;
  }
`;

export const searchboxMediumScreen = css`
  input {
    padding-block: 9px;
    height: 42px;
  }
`;

export const searchboxScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: searchboxMediumScreen,
  },
];
