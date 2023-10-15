import { css, unsafeCSS } from 'lit';

const disabledThumbStyles = unsafeCSS(`
  border: 1px solid var(--oryx-color-neutral-8);
  cursor: default;
`);

const thumbStyles = unsafeCSS(`
  width: var(--_height);
  height: var(--_height);
  background: var(--oryx-color-neutral-4);
  border: 1px solid var(--oryx-color-neutral-9);
  border-radius: 50%;
  cursor: pointer;
`);

export const multiRangeStyles = css`
  :host {
    --_height: 24px;

    padding: 0 calc(var(--_height) / 2);
    background: var(--oryx-color-neutral-8);
    height: 6px;
    display: grid;
    grid-template-columns: var(--_multi-range-min) 1fr 1fr var(
        --_multi-range-max
      );
    align-items: center;
    align-content: center;
    position: relative;
    border-radius: 3px;
    margin: 9px 0;
  }

  :host([invalid]) {
    display: none;
  }

  :host::before,
  label {
    grid-row: 1;
  }

  label {
    height: var(--_height);
    z-index: var(--_z-index, 2);
  }

  label:hover {
    --_z-index: 1;
    --_pointer-events: all;

    cursor: pointer;
  }

  label:first-child {
    grid-column: 1 / span 2;
  }

  label:last-child {
    grid-column: 3 / span 4;
  }

  input,
  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
  }

  input {
    background: transparent;
    margin: 0;
    position: absolute;
    width: 100%;
    height: 0;
    inset-block-start: 3px;
    outline: none;
    pointer-events: var(--_pointer-events, none);
  }

  label:first-child input {
    inset-inline-start: 0;
  }

  label:last-child input {
    inset-inline-end: 0;
  }

  input::-webkit-slider-thumb {
    ${thumbStyles}
  }

  input::-moz-range-thumb {
    ${thumbStyles}
  }

  input:focus::-webkit-slider-thumb {
    border: 1px solid var(--oryx-color-primary-9);
    box-shadow: 0 0 3px var(--oryx-color-primary-9);
  }

  :host::before {
    content: '';
    display: block;
    background-color: var(--oryx-color-primary-9);
    grid-column: 2 / span 2;
    height: inherit;
  }

  :host([disabled])::before {
    background-color: var(--oryx-color-neutral-8);
  }

  input:disabled {
    cursor: default;
  }

  input:disabled::-webkit-slider-thumb {
    ${disabledThumbStyles}
  }

  input:disabled::-moz-range-thumb {
    ${disabledThumbStyles}
  }
`;
