import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { mdScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-icon-size: 22px;

    display: inline-flex;
  }

  :host([label]:not([label=''])) {
    position: relative;
    padding-top: 22px;
  }

  input {
    appearance: textfield;
    text-align: center;
  }

  oryx-input {
    --oryx-border-radius: 0;

    width: var(--oryx-cart-quantity-input-width, 75px);
  }

  oryx-input:not([hasError]) {
    border-color: var(--oryx-cart-quantity-input-button-border-color);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
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

  button {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    background: var(--oryx-cart-quantity-input-button-background-color);
    color: var(--oryx-cart-quantity-input-button-color);
    border: 2px solid var(--oryx-cart-quantity-input-button-border-color);
    outline: none;
    border-radius: 2px;
    margin: 0;
  }

  button[disabled] {
    color: var(--oryx-cart-quantity-input-button-disabled-color);
    cursor: default;
    pointer-events: none;
  }

  button:hover {
    background: var(--oryx-cart-quantity-input-button-hover-background-color);
    border-color: var(--oryx-cart-quantity-input-button-border-color);
  }

  button:active,
  oryx-input:hover,
  oryx-input:active {
    z-index: 1;
  }

  oryx-input:not([hasError]):hover,
  oryx-input:not([hasError]):active {
    border-color: var(--oryx-cart-quantity-input-input-border-color);
  }

  button:focus-visible {
    border: 2px solid var(--oryx-color-primary-300);
    box-shadow: 0 0 3px var(--oryx-color-primary-300);
    z-index: 1;
  }

  oryx-input::part(label) {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    text-transform: unset;
  }

  oryx-input::part(label)::after {
    content: '';
  }
`;

const mediumScreen = css`
  :host {
    --oryx-icon-size: 18px;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  {
    media: mdScreen,
    css: mediumScreen,
  },
];
