import { css } from 'lit';

export const tileStyles = css`
  ::slotted(*) {
    padding: var(--oryx-tile-padding, 20px);
    outline: none;
    border: var(--oryx-border-thin) solid var(--oryx-color-neutral-6);
    box-sizing: border-box;
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation);
    border-radius: var(
      --oryx-tile-border-radius,
      var(--oryx-border-radius-small)
    );
    background-color: var(--oryx-color-neutral-1);
    transition: var(--oryx-transition-time);
  }

  ::slotted(a) {
    display: block;
  }

  ::slotted(*:active) {
    border-color: var(--oryx-color-primary-10);
  }

  ::slotted(*:hover:not(:active)) {
    border-color: var(--oryx-color-neutral-8);
    box-shadow: var(--oryx-elevation-1) var(--oryx-color-elevation);
  }

  ::slotted(*:focus-visible) {
    border-color: var(--oryx-color-primary-9);
    box-shadow: 0 0 3px var(--oryx-color-primary-9);
  }

  :host([selected]) ::slotted(*) {
    border-width: 2px;
    padding: calc(var(--oryx-tile-padding, 20px) - 1px);
    border: var(--oryx-border-thick) solid var(--oryx-color-primary-9);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation);
  }

  :host([selected]) ::slotted(*:hover) {
    box-shadow: var(--oryx-elevation-1) var(--oryx-color-elevation);
  }

  :host([selected]) ::slotted(*:focus-visible) {
    box-shadow: 0 0 3px var(--oryx-color-primary-9);
  }
`;
