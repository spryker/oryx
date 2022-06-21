import { css } from 'lit';

export const toggleIconStyles = css`
  :host {
    --oryx-icon-size: var(--oryx-icon-size-large);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: var(--oryx-border-radius-small);
  }

  :host([has-text]),
  :host([has-text]) ::slotted(input)::after {
    border-radius: var(--oryx-border-radius-large);
  }

  :host,
  ::slotted(*) {
    transition: var(--oryx-transition-time);
  }

  :host(:not([has-text])) {
    padding: 7px;
  }

  :host([has-text][size='small']) {
    padding: 8px 12px;
  }

  :host([has-text]),
  :host([has-text][size='medium']) {
    padding: 8px 12px;
  }

  :host([has-text][size='large']) {
    padding: 12px 16px;
  }

  ::slotted([disabled]) {
    pointer-events: none;
  }

  ::slotted(input) {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    appearance: none;
    outline: none;
    border-radius: var(--oryx-border-radius-small);
  }

  ::slotted(input)::after {
    cursor: pointer;
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-radius: var(--oryx-border-radius-small);
    background: var(--oryx-color-canvas);
    border: 1px solid var(--oryx-color-neutral-light);
  }

  ::slotted(input:hover:not([disabled]))::after {
    background: var(--oryx-color-neutral-lighter);
    border-color: var(--oryx-color-neutral);
  }

  ::slotted(input:active:not([disabled]))::after {
    background: var(--oryx-color-neutral-lighter);
    border-color: var(--oryx-color-neutral-dark);
  }

  ::slotted(input:checked:active:not([disabled]))::after,
  ::slotted(input:checked:hover:not([disabled]))::after {
    border-color: var(--oryx-color-brand-dark);
  }

  ::slotted(input:checked:active:not([disabled]))::after {
    background: var(--oryx-color-neutral-lighter);
  }

  ::slotted(input:focus-visible:not(:active))::after {
    box-shadow: 0 0 3px var(--oryx-color-brand),
      inset 0 0 0 1px var(--oryx-color-canvas),
      inset 0 0 0 2px var(--oryx-color-neutral);
    border: none;
  }

  ::slotted(input:checked:focus-visible:not(:active))::after {
    box-shadow: 0 0 3px var(--oryx-color-brand),
      inset 0 0 0 1px var(--oryx-color-brand-lighter),
      inset 0 0 0 2px var(--oryx-color-brand);
    border: none;
  }

  ::slotted(input[disabled])::after {
    background: var(--oryx-color-neutral-lighter);
    border-color: var(--oryx-color-neutral);
  }

  ::slotted(input:checked:not([disabled]))::after {
    border-color: var(--oryx-color-brand);
    background: var(--oryx-color-brand-lighter);
  }

  ::slotted(input:checked[disabled])::after {
    border-color: var(--oryx-color-neutral-dark);
  }

  ::slotted(oryx-icon),
  ::slotted(span) {
    z-index: 1;
    pointer-events: none;
  }

  ::slotted(span) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ::slotted(oryx-icon) {
    color: var(--oryx-color-neutral-dark);
  }

  :host([checked]:not([disabled])) ::slotted(oryx-icon) {
    color: var(--oryx-color-brand);
  }
`;
