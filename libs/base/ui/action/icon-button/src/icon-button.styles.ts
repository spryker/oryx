import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--oryx-color-neutral-400);
  }

  ::slotted(*) {
    cursor: pointer;
    background: transparent;
    border: solid transparent 1px;
    border-radius: 50%;
    outline: none;
    color: inherit;
    transition: var(--oryx-transition-time);
  }

  :host(:hover) ::slotted(:not([disabled])),
  :host ::slotted(:hover:not([disabled])) {
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

  :host(:active) ::slotted(:not([disabled])),
  ::slotted(:active:not([disabled])) {
    border-color: var(--oryx-color-neutral-300);
    background: var(--oryx-color-canvas-200);
  }

  ::slotted([disabled]) {
    cursor: default;
    color: var(--oryx-color-neutral-200);
    border-color: var(--oryx-color-canvas-500);
    background: var(--oryx-color-canvas-200);
  }

  :host([size='sm']) ::slotted(*) {
    --oryx-icon-size: var(--oryx-icon-size-small);

    padding: 3px;
  }

  :host([size='md']) ::slotted(*) {
    --oryx-icon-size: var(--oryx-icon-size-medium);

    padding: 5px;
  }

  :host([size='lg']) ::slotted(*) {
    --oryx-icon-size: var(--oryx-icon-size-large);

    padding: 6px;
  }
`;
