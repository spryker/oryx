import {
  primaryColorBase,
  primaryColorDark,
  primaryColorLighter,
  Size,
} from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

const smallSize = unsafeCSS(`[size='${Size.Sm}']`);
const mediumSize = unsafeCSS(`[size='${Size.Md}']`);
const largeSize = unsafeCSS(`[size='${Size.Lg}']`);

export const toggleIconStyles = css`
  :host {
    --oryx-icon-size: var(--oryx-icon-size-large);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: var(--oryx-border-radius-small);
    z-index: 0;
  }

  :host([has-text]),
  :host([has-text]) ::slotted(input)::after {
    border-radius: var(--oryx-border-radius-large);
  }

  :host([hasError])
    ::slotted(:is(input, input:hover, input:checked, input:checked:hover))::after {
    border-color: var(--oryx-color-error-300);
  }

  :host,
  ::slotted(*) {
    transition: var(--oryx-transition-time);
  }

  :host(:not([has-text])) {
    gap: 0;
    padding: 7px;
  }

  :host([has-text]${smallSize}) {
    padding: 8px 12px;
  }

  :host([has-text]),
  :host([has-text]${mediumSize}) {
    padding: 8px 12px;
  }

  :host([has-text]${largeSize}) {
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
    background: var(--oryx-color-canvas-100);
    border: 1px solid var(--oryx-color-canvas-500);
  }

  ::slotted(input:hover:not([disabled]))::after {
    background: var(--oryx-color-canvas-200);
    border-color: var(--oryx-color-neutral-200);
    box-shadow: 0 1px 3px 0 var(--oryx-color-elevation-2);
  }

  ::slotted(input:active:not([disabled]))::after {
    background: var(--oryx-color-canvas-200);
    border-color: var(--oryx-color-neutral-300);
  }

  ::slotted(input:checked:active:not([disabled]))::after,
  ::slotted(input:checked:hover:not([disabled]))::after {
    border-color: ${primaryColorDark};
  }

  ::slotted(input:checked:active:not([disabled]))::after {
    background: var(--oryx-color-canvas-200);
  }

  ::slotted(input:focus-visible:not(:active))::after {
    box-shadow: 0 0 3px ${primaryColorBase},
      inset 0 0 0 1px var(--oryx-color-canvas-100),
      inset 0 0 0 2px var(--oryx-color-neutral-200);
    border: none;
  }

  ::slotted(input:checked:focus-visible:not(:active))::after {
    box-shadow: 0 0 3px ${primaryColorBase},
      inset 0 0 0 1px ${primaryColorLighter},
      inset 0 0 0 2px ${primaryColorBase};
    border: none;
  }

  :host([hasError]) ::slotted(input:focus-visible:not(:active))::after {
    box-shadow: 0 0 3px ${primaryColorBase},
      inset 0 0 0 1px var(--oryx-color-error-300),
      inset 0 0 0 2px var(--oryx-color-neutral-200);
  }

  :host([hasError]) ::slotted(input:checked:focus-visible:not(:active))::after {
    box-shadow: 0 0 3px ${primaryColorBase},
      inset 0 0 0 1px var(--oryx-color-error-300),
      inset 0 0 0 2px ${primaryColorBase};
  }

  ::slotted(input[disabled])::after {
    background: var(--oryx-color-canvas-200);
    border-color: var(--oryx-color-neutral-200);
  }

  ::slotted(input:checked:not([disabled]))::after {
    border-color: ${primaryColorBase};
    background: ${primaryColorLighter};
  }

  ::slotted(input:checked[disabled])::after {
    border-color: var(--oryx-color-neutral-300);
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
    color: var(--oryx-color-neutral-300);
  }

  :host([checked]:not([disabled])) ::slotted(oryx-icon) {
    color: ${primaryColorBase};
  }
`;
