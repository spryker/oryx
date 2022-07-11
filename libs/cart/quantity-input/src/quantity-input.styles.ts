import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
  }

  input[type='number'] {
    appearance: textfield;
    text-align: center;
  }

  oryx-input {
    --oryx-border-radius: 0;

    border-color: #dce0e5;
    width: 75px;
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
    cursor: pointer;
    width: 38px;
    height: 42px;
    background: #f5f5f5;
    color: #121212;
    border: 2px solid #dce0e5;
    outline: none;
    border-radius: 2px;
  }

  button[disabled] {
    color: #b2b2b2;
    cursor: default;
  }

  button:not([disabled]):hover {
    background: #e7eaee;
    border-color: #dce0e5;
  }

  button:not([disabled]):active,
  oryx-input:not([disabled]):hover,
  oryx-input:not([disabled]):active {
    border-color: #b7bec9;
    z-index: 1;
  }

  button:not([disabled]):focus-visible {
    border: 2px solid var(--oryx-color-brand);
    box-shadow: 0 0 3px var(--oryx-color-brand);
    z-index: 1;
  }
`;
