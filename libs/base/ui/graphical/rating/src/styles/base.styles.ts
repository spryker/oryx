import { Size } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

const smallSize = unsafeCSS(`[size='${Size.Sm}']`);

export const ratingBaseStyles = css`
  :host {
    --oryx-rating-size: 18px;
    --oryx-icon-size: 18px;
    --_margin: 3px;

    display: flex;
    align-items: center;
    font-size: var(--oryx-rating-size);
    gap: 10px;
  }

  :host(${smallSize}) {
    --oryx-rating-size: 12px;
    --oryx-icon-size: 12px;
    --_margin: 2px;
  }

  fieldset {
    all: unset;
    white-space: nowrap;
  }

  input {
    appearance: none;
    display: inline-block;
    flex: 0 0 var(--oryx-rating-size);
    width: var(--oryx-rating-size);
    aspect-ratio: 1/1;
    position: relative;
    margin: 0;
    border-radius: var(--oryx-border-radius-small);
    outline: none;
  }

  fieldset slot {
    transition: 0.4s ease-out;
    pointer-events: none;
    display: inline-block;
    padding: var(--_margin);
    line-height: var(--oryx-rating-size);
    height: var(--oryx-rating-size);
    width: var(--oryx-rating-size);
  }

  fieldset slot,
  fieldset ::slotted(*) {
    color: var(--oryx-rating-color-active, var(--oryx-color-secondary-9));
    font-size: 1em;
  }

  fieldset slot svg {
    fill: currentColor;
  }

  input:focus-visible + slot {
    border-radius: 4px;
    background-color: var(--oryx-color-neutral-3);
    box-shadow: var(--oryx-box-shadow-focus);
  }

  label {
    position: absolute;
    opacity: 0;
  }

  slot,
  b {
    font-size: 1rem;
  }

  :host > svg {
    width: 0;
    height: 0;
  }
`;
