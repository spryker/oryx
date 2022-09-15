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
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    background: #f5f5f5;
    color: #121212;
    border: 2px solid #dce0e5;
    outline: none;
    border-radius: 2px;
  }

  button[disabled] {
    color: #b2b2b2;
    cursor: default;
    pointer-events: none;
  }

  button:hover {
    background: #e7eaee;
    border-color: #dce0e5;
  }

  button:active,
  oryx-input:hover,
  oryx-input:active {
    border-color: #b7bec9;
    z-index: 1;
  }

  button:focus-visible {
    border: 2px solid var(--oryx-color-brand);
    box-shadow: 0 0 3px var(--oryx-color-brand);
    z-index: 1;
  }

  oryx-input::part(label) {
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    text-transform: unset;
  }

  @media (min-width: 769px) {
    :host {
      --oryx-icon-size: 18px;
    }
  }
`;
