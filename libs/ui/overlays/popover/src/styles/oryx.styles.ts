import { css } from 'lit';

export const popoverStyles = css`
  :host {
    background-color: var(--oryx-color-canvas-100);
    box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color);
    border-radius: var(--oryx-border-radius-small);
    transition: transform var(--oryx-transition-time) ease-in-out;
  }
`;
