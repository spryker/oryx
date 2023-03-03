import { css } from 'lit';

export const ratingReadonlyStyles = css`
  :host([readonly]) {
    padding: var(--_margin);
  }

  :host([readonly]) fieldset {
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: calc(2 * var(--_margin));
  }

  :host([readonly]) input {
    background-color: var(--oryx-color-canvas-500);
  }

  :host([readonly]:not([size='sm'])) input {
    /* stylelint-disable-next-line */
    clip-path: url('#star-path');
  }

  :host([readonly][size='sm']) input {
    /* stylelint-disable-next-line */
    clip-path: url('#star-path-small');
  }

  :host([readonly]) input::after {
    content: '';
    position: absolute;
    height: 100%;
    background-color: orange;
    width: min(calc(((var(--rate) - var(--pos) + 1) * 100%)), 100%);
  }

  .review-count {
    color: var(--oryx-color-neutral-300);
    line-height: var(--oryx-rating-size);
    font-size: 1rem;
  }
`;
