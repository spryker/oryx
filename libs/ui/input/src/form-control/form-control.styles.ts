import { css } from 'lit';

export const formControlStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    border-color: var(--oryx-color-neutral-light);
  }

  label {
    border-color: inherit;
  }

  .control {
    display: flex;
    align-items: stretch;
    position: relative;
    border-style: solid;
    border-width: 2px;
    border-color: inherit;
    border-radius: var(--oryx-border-radius);
    transition: all var(--oryx-transition-time);
    color: var(--oryx-color-neutral-dark);
    background-color: var(--oryx-color-canvas);
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .control {
    background-color: var(--oryx-color-neutral-lighter);
  }

  :host(:not(.has-error)) .control:hover,
  :host(:not(.has-error)) .control:focus-within {
    border-color: var(--oryx-color-neutral);
  }

  :host(:not(.has-error)) .control:focus-within {
    border-color: var(--oryx-color-focus);
    transition-property: border;
  }

  /* visible focus effect */
  :host([visible-focus]:not(.has-error)) .control:focus-within {
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-brand);
    transition-property: box-shadow, border;
  }

  input,
  ::slotted(input) {
    height: 38px;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }

  input,
  ::slotted(input),
  textarea,
  ::slotted(textarea) {
    width: 100%;
    box-sizing: border-box;
    padding: 7px 11px;
    background-color: transparent;
    border: none;
    outline: none;
    font: inherit;
    color: var(--oryx-color-ink);
  }

  textarea,
  ::slotted(textarea) {
    height: 80px;
  }

  ::placeholder,
  ::slotted(input)::placeholder {
    color: var(--oryx-color-neutral-dark);
  }
`;
