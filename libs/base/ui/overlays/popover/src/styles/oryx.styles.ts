import { css } from 'lit';

export const popoverStyles = css`
  :host {
    background-color: var(--oryx-color-neutral-1);
    box-shadow: var(--oryx-elevation-2) var(--oryx-color-elevation);
    border-radius: var(
      --oryx-popover-border-radius,
      var(--oryx-border-radius-small)
    );
    transition: transform var(--oryx-transition-time) ease-in-out;
  }
`;
