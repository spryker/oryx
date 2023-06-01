import { css } from 'lit';

export const iconButtonStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--oryx-color-neutral-11);
  }

  ::slotted(*:first-child) {
    box-sizing: border-box;
    cursor: pointer;
    background: var(--oryx-color-neutral-1);
    border: solid transparent 1px;
    border-radius: 50%;
    outline: none;
    color: inherit;
    transition: var(--oryx-transition-time);
  }

  :host(:hover) ::slotted(:first-child:not([disabled])),
  ::slotted(:first-child:hover:not([disabled])) {
    border-color: var(--oryx-color-neutral-8);
    background: var(--oryx-color-neutral-3);
  }

  ::slotted(:focus-visible:not(:active):not([disabled])) {
    border-color: var(--oryx-color-neutral-1);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  ::slotted(:focus-visible:hover:not(:active):not([disabled])) {
    border-color: var(--oryx-color-neutral-3);
  }

  :host(:active) ::slotted(:first-child:not([disabled])),
  ::slotted(:active:first-child:not([disabled])) {
    border-color: var(--oryx-color-neutral-9);
    background: var(--oryx-color-neutral-3);
  }

  ::slotted([disabled]) {
    cursor: default;
    color: var(--oryx-color-neutral-8);
    border-color: var(--oryx-color-neutral-6);
    background: var(--oryx-color-neutral-1);
  }

  ::slotted(a) {
    text-decoration: none;
  }

  :host([size='sm']) ::slotted(*:first-child) {
    --oryx-icon-size: var(--oryx-icon-size-sm, 16px);

    padding: 3px;
  }

  :host([size='md']) ::slotted(*:first-child) {
    --oryx-icon-size: var(--oryx-icon-size-md, 20px);

    padding: 5px;
  }

  :host([size='lg']) ::slotted(*:first-child) {
    --oryx-icon-size: var(--oryx-icon-size-lg, 24px);

    padding: 6px;
  }
`;
