import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const searchboxStyles = css`
  [slot='prefix'] {
    color: var(--oryx-color-neutral-11);
  }

  input::placeholder {
    color: var(--oryx-color-neutral-9);
  }

  input {
    padding-block: 9px;
    height: 42px;
  }

  oryx-button[slot='suffix'] {
    --_color-text: var(--oryx-color-primary-9);
  }

  oryx-icon-button[slot='suffix'] {
    --oryx-icon-button-color: var(--oryx-color-neutral-11);
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

  oryx-content-link::part(link) {
    padding: 0;
    white-space: normal;
    border-radius: 0;
  }

  .product {
    transition: background var(--oryx-transition-time);
    background: transparent;
    color: var(--oryx-color-neutral-9);
  }

  .product:hover {
    background: var(--oryx-color-neutral-3);
  }

  .product oryx-product-title {
    margin-block-end: 4px;
  }
`;

const smallScreen = css`
  input {
    padding-block: 16px;
    height: 56px;
  }
`;

export const searchboxScreenStyles = screenCss({
  sm: smallScreen,
});
