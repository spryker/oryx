import { css } from 'lit';

/**
 * Provides error styling for the control.
 */
export const disableStyles = css`
  :host([disabled]) {
    pointer-events: none;
  }
  :host([disabled]) .control {
    background-color: var(--oryx-color-neutral-lighter);
  }
  :host([disabled]) slot[name='error'] ::slotted(oryx-icon) {
    color: var(--oryx-color-neutral);
  }
`;
