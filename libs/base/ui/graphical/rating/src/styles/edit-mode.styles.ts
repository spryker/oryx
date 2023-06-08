import { css } from 'lit';

// Note: the pseudo states in storybook are actual destroying some of the
// :not selectors, which destroys the UX in the following case:
//   - when you hover over a selected rating, the stars in between won't get highlighted
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
    color: var(--oryx-rating-color-inactive, var(--oryx-color-neutral-8));
  }

  input:hover:not(:checked) + slot,
  input:hover:not(:checked) + ::slotted(*) {
    color: var(--oryx-rating-color-hover, var(--oryx-color-secondary-10));
  }

  fieldset input:valid:hover + slot ~ slot[has-char],
  fieldset input:hover + slot ~ slot[has-char],
  fieldset:not(:hover) input:checked + slot ~ slot[has-char] {
    opacity: 0.3;
  }
`;
