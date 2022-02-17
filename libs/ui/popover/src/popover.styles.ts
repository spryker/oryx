import { css } from 'lit';

export const popoverStyles = css`
  :host {
    position: absolute;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    background-color: var(--oryx-color-canvas);
    box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color);
    border-radius: var(--oryx-border-radius-small);
    user-select: none;
    transform-origin: left top;
    transition: transform var(--oryx-transition-time) ease-in-out;
    transform: scaleY(var(--oryx-popover-visible, 0));
  }

  :host([show]) {
    --oryx-popover-visible: 1;
  }
`;
