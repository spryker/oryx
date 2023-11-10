import { featureVersion } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

export const styles = css`
  :host {
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
    height: 38px;
  }

  oryx-input {
    --oryx-form-control-border-radius: 0;

    ${unsafeCSS(
      featureVersion >= '1.2'
        ? '--oryx-quantity-input-width: 71px;'
        : '--oryx-cart-quantity-input-width: 71px;'
    )}
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
  }

  button {
    display: flex;
    align-items: center;
    cursor: pointer;
    background: var(--oryx-color-neutral-3);
    color: var(--oryx-color-neutral-9);
    border: 2px solid var(--oryx-color-neutral-5);
    outline: none;
    border-radius: var(--oryx-border-radius-small);
    margin: 0;
    height: 42px;
    aspect-ratio: 1/1;
    justify-content: center;
    box-sizing: border-box;
    transition: var(--oryx-transition-time);
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
    background: var(--oryx-color-neutral-4);
    border-color: var(--oryx-color-neutral-7);
  }

  button:active {
    background-color: var(--oryx-color-neutral-6);
  }

  button:focus-visible {
    border: 2px solid var(--oryx-color-primary-9);
    box-shadow: 0 0 3px var(--oryx-color-primary-9);
    z-index: 1;
  }

  button[disabled] {
    color: var(--oryx-color-neutral-7);
    cursor: default;
    pointer-events: none;
  }

  button:hover,
  button:active {
    z-index: 1;
  }

  oryx-input:focus-within {
    z-index: 2;
  }

  oryx-input:not([hasError]):hover,
  oryx-input:not([hasError]):active {
    border-color: var(--oryx-color-neutral-5);
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
