import { css } from 'lit';

export const toggleIconStyles = css`
  :host {
    position: relative;
    display: inline-flex;
  }

  :host,
  ::slotted(input) {
    min-height: 38px;
    min-width: 38px;
  }

  ::slotted(oryx-icon) {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--oryx-color-neutral-dark);
    pointer-events: none;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);
  }

  ::slotted(input) {
    cursor: pointer;
    margin: 0;
    padding: 6px;
    appearance: none;
    flex: 1;
    border: 1px solid var(--oryx-color-neutral-light);
    background: var(--oryx-color-canvas);
    box-sizing: border-box;
    border-radius: 4px;
    outline: none;
  }

  ::slotted([disabled]) {
    pointer-events: none;
  }

  ::slotted(input:hover) {
    border-color: var(--oryx-color-neutral);
    background: var(--oryx-color-neutral-lighter);
  }

  ::slotted(input:active) {
    background: var(--oryx-color-neutral-lighter);
    border-color: var(--oryx-color-neutral-dark);
  }

  ::slotted(input:focus-visible:not(:active)) {
    box-shadow: 0 0 3px var(--oryx-color-brand);
    border: solid 1px transparent;
    outline: solid 1px var(--oryx-color-neutral);
    outline-offset: -2px;
  }

  ::slotted(input[checked]:focus-visible:not(:active)) {
    border-color: transparent;
    outline-color: var(--oryx-color-brand);
  }

  ::slotted(input[disabled]) {
    background: var(--oryx-color-neutral-light);
  }

  ::slotted(input[checked]:not([disabled])) {
    border-color: var(--oryx-color-brand);
    background: var(--oryx-color-brand-lighter);
  }

  ::slotted(input[checked]:active:not([disabled])) {
    border-color: var(--oryx-color-brand-dark);
    background: var(--oryx-color-neutral-lighter);
  }

  ::slotted(input[checked][disabled]) {
    border-color: var(--oryx-color-neutral-dark);
  }

  :host([checked]:not([disabled])) ::slotted(oryx-icon) {
    color: var(--oryx-color-brand);
  }

  ::slotted(input[checked]:hover:not([disabled])) {
    background-color: var(--oryx-color-neutral-lighter);
  }
`;
