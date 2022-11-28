import { css } from 'lit';

export const iconButtonBaseStyles = css`
  :host {
    color: var(--oryx-icon-button-color, var(--oryx-color-neutral-300));
    display: inline-block;
  }

  ::slotted(*) {
    display: flex;
    position: relative;
    flex: 100%;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    transition: var(--oryx-transition-time);
    background: transparent;
    outline: none;
    border: solid transparent 1px;
    border-radius: 50%;
    color: inherit;
  }

  ::slotted(:hover:not([disabled])) {
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

  :host([size='small']) ::slotted(*) {
    --oryx-icon-size: var(--oryx-icon-size-small);

    padding: 5px;
  }

  :host([size='medium']) ::slotted(*) {
    --oryx-icon-size: var(--oryx-icon-size-medium);

    padding: 10px;
  }

  :host([size='large']) ::slotted(*) {
    --oryx-icon-size: var(--oryx-icon-size-large);

    padding: 11px;
  }
`;
