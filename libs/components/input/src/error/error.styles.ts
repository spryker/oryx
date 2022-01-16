import { css } from 'lit';

/**
 * Provides error styling for the control.
 */
export const errorStyles = css`
  :host(.has-error) {
    border-color: var(--oryx-color-error);
  }

  :host([disabled]) slot[name='error'] ::slotted(oryx-icon) {
    color: var(--oryx-color-neutral);
  }
`;
