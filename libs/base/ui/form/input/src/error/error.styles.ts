import { css } from 'lit';

/**
 * Provides error styling for the control.
 */
export const errorStyles = css`
  :host([hasError]) {
    border-color: var(--oryx-color-error-9);
  }

  :host([disabled]) slot[name='error'] ::slotted(oryx-icon) {
    color: var(--oryx-color-neutral-8);
  }

  oryx-error-message::part(icon) {
    align-self: start;
    margin-top: 3px;
  }
`;
