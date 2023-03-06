import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-icon-size: 16px;

    display: inline-flex;
  }

  :host([label]:not([label=''])) {
    position: relative;
    padding-block-start: 22px;
  }

  input {
    appearance: textfield;
    text-align: center;
    font-weight: 600;
  }

  oryx-input {
    --oryx-form-control-border-radius: 0;

    width: var(--oryx-cart-quantity-input-width, 71px);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
  }

  button {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    background: var(--oryx-color-canvas-200);
    color: var(--oryx-color-neutral-300);
    border: 2px solid var(--oryx-color-canvas-400);
    outline: none;
    border-radius: var(--oryx-border-radius-small);
    margin: 0;
  }

  button:nth-of-type(1) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
    margin-inline-end: -2px;
  }

  button:nth-of-type(2) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    margin-inline-start: -2px;
  }

  button:hover {
    background: var(--oryx-color-canvas-300);
    border-color: var(--oryx-color-neutral-100);
  }

  button:active {
    background-color: var(--oryx-color-canvas-500);
  }

  button:focus-visible {
    border: 2px solid var(--oryx-color-primary-300);
    box-shadow: 0 0 3px var(--oryx-color-primary-300);
    z-index: 1;
  }

  button[disabled] {
    color: var(--oryx-color-neutral-100);
    cursor: default;
    pointer-events: none;
  }

  :host(:not(:focus-within)) button:hover,
  button:active,
  oryx-input:hover,
  oryx-input:active {
    z-index: 1;
  }

  oryx-input:not([hasError]):hover,
  oryx-input:not([hasError]):active {
    border-color: var(--oryx-color-canvas-400);
  }

  oryx-input::part(label) {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%;
    text-transform: unset;
  }

  oryx-input::part(label)::after {
    content: '';
  }
`;

// TODO: consider moving this to global design tokens instead
// alternatively, we could make it inline in the definition
const smallScreen = css`
  :host {
    --oryx-icon-size: 22px;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
];
