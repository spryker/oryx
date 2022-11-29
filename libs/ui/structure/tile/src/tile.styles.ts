import { css } from 'lit';

export const tileStyles = css`
  ::slotted(*) {
    display: block;
    padding: var(--oryx-tile-padding, 20px);
    outline: none;
    border: var(--oryx-border-thin) solid var(--oryx-color-canvas-500);
    box-sizing: border-box;
    box-shadow: var(--oryx-elevation-0) var(--oryx-elevation-color);
    border-radius: var(--oryx-border-radius-small);
    background-color: var(--oryx-color-canvas-100);
    transition: var(--oryx-transition-time);
  }

  ::slotted(*:active) {
    border-color: var(--oryx-color-primary-400);
  }

  ::slotted(*:hover:not(:active)) {
    border-color: var(--oryx-color-neutral-200);
    box-shadow: var(--oryx-elevation-1) var(--oryx-elevation-color);
  }

  ::slotted(*:focus-visible) {
    border-color: var(--oryx-color-primary-300);
    box-shadow: 0 0 3px var(--oryx-color-primary-300);
  }

  :host([selected]) ::slotted(*) {
    border-width: 2px;
    padding: 19px;
    border: var(--oryx-border-thick) solid var(--oryx-color-primary-300);
    box-shadow: var(--oryx-elevation-0) var(--oryx-elevation-color);
  }

  :host([selected]) ::slotted(*:hover) {
    box-shadow: var(--oryx-elevation-1) var(--oryx-elevation-color);
  }

  :host([selected]) ::slotted(*:focus-visible) {
    box-shadow: 0 0 3px var(--oryx-color-primary-300);
  }
`;
