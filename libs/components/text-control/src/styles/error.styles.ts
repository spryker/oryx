import { css } from 'lit';

/**
 * Provides error styling for the control.
 */
export const errorStyles = css`
  :host([showError]) .control {
    border-color: var(--oryx-color-error);
  }
`;
