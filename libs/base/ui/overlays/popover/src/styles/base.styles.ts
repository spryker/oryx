import { css } from 'lit';

export const popoverBaseStyles = css`
  :host {
    display: flex;
    align-items: stretch;
    flex-direction: column;
    position: absolute;
    user-select: none;
    transform-origin: left top;
    transform: scaleY(var(--oryx-popover-visible, 0));
    z-index: calc(var(--oryx-popover-z-index, var(--oryx-z-index, 1)) + 1);
  }

  :host([show]) {
    --oryx-popover-visible: 1;
  }
`;
