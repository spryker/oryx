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

  :host > * {
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

  label:nth-of-type(1) {
    grid-column: 1 / span 2;
  }

  label:nth-of-type(2) {
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
    inset-inline-start: 0;
    outline: none;
    pointer-events: var(--_pointer-events, none);
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

  .active {
    background-color: var(--oryx-color-primary-9);
    grid-column: 2 / span 2;
    height: inherit;
  }

  :host([disabled]) .active {
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
