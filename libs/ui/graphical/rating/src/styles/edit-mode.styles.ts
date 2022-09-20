import { css } from 'lit';

export const ratingEditModeStyles = css`
  :host(:not([readonly])) input {
    position: absolute;
    margin: 0;
    outline: none;
    box-sizing: content-box;
    padding: var(--_margin);
  }

  :host(:not([readonly])) input:not(:checked) {
    cursor: pointer;
  }

  fieldset:not(:hover) input:invalid + slot,
  fieldset:not(:hover) input:invalid + ::slotted(*),
  fieldset :is(input:hover, :not(:hover) input:checked) + slot ~ slot,
  fieldset :is(input:hover, :not(:hover) input:checked) + slot ~ ::slotted(*) {
    color: var(--oryx-rating-color-inactive, var(--oryx-color-neutral));
  }

  input:hover:not(:checked) + slot,
  input:hover:not(:checked) + ::slotted(*) {
    color: var(--oryx-rating-color-hover, #e4a41c);
  }

  fieldset input:valid:hover + slot ~ slot[has-char],
  fieldset input:hover + slot ~ slot[has-char],
  fieldset:not(:hover) input:checked + slot ~ slot[has-char] {
    opacity: 0.3;
  }
`;
