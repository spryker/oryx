import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    color: var(--oryx-icon-button-color, var(--oryx-color-neutral-dark));
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
    background: var(--oryx-color-canvas);
    outline: none;
    border: solid var(--oryx-color-canvas) 1px;
    border-radius: 50%;
    color: inherit;
  }

  ::slotted(*)::before {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  ::slotted(:hover:not([disabled])) {
    border-color: var(--oryx-color-neutral);
    background: var(--oryx-color-neutral-lighter);
  }

  ::slotted(:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-canvas);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  ::slotted(:focus-visible:hover:not(:active):not([disabled])) {
    border-color: var(--oryx-color-neutral-lighter);
  }

  ::slotted(:active:not([disabled])) {
    border-color: var(--oryx-color-neutral-dark);
    background: var(--oryx-color-neutral-lighter);
  }

  ::slotted([disabled]) {
    cursor: default;
    color: var(--oryx-color-neutral);
    border-color: var(--oryx-color-neutral-light);
    background: var(--oryx-color-neutral-lighter);
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
