import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--oryx-color-neutral-400);
  }

  ::slotted(*:first-child) {
    box-sizing: border-box;
    cursor: pointer;
    background: var(--oryx-color-canvas-100);
    border: solid transparent 1px;
    border-radius: 50%;
    outline: none;
    color: inherit;
    transition: var(--oryx-transition-time);
  }

  :host(:hover) ::slotted(:first-child:not([disabled])),
  ::slotted(:first-child:hover:not([disabled])) {
    border-color: var(--oryx-color-neutral-200);
    background: var(--oryx-color-canvas-200);
  }

  ::slotted(:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas-100);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  ::slotted(:focus-visible:hover:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas-200);
  }

  :host(:active) ::slotted(:first-child:not([disabled])),
  ::slotted(:active:first-child:not([disabled])) {
    border-color: var(--oryx-color-neutral-300);
    background: var(--oryx-color-canvas-200);
  }

  ::slotted([disabled]) {
    cursor: default;
    color: var(--oryx-color-neutral-200);
    border-color: var(--oryx-color-canvas-500);
    background: var(--oryx-color-canvas-100);
  }

  :host([size='sm']) ::slotted(*:first-child) {
    --oryx-icon-size: var(--oryx-icon-size-small);

    padding: 3px;
    height: 24px;
  }

  :host([size='md']) ::slotted(*:first-child) {
    --oryx-icon-size: var(--oryx-icon-size-medium);

    padding: 5px;
    height: 32px;
  }

  :host([size='lg']) ::slotted(*:first-child) {
    --oryx-icon-size: var(--oryx-icon-size-large);

    padding: 6px;
    height: 38px;
  }
`;
