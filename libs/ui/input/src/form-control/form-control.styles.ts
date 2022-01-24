import { css } from 'lit';

export const formControlStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border-color: var(--oryx-color-neutral-light);
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
    cursor: pointer;
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
    height: 42px;
    padding: 4px 13px;
    text-overflow: ellipsis;
  }

  input,
  ::slotted(input),
  textarea,
  ::slotted(textarea) {
    flex: 100%;
    padding: 9px 13px;
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
