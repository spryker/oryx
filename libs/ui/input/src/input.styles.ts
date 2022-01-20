import { css } from 'lit';

export const inputStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    cursor: pointer;
    border-color: var(--oryx-color-neutral-light);
  }

  label {
    display: flex;
    margin-bottom: 8px;
    cursor: inherit;
    font-weight: 400;
    font-size: 12px;
    text-transform: uppercase;
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
    width: 100%;
    height: 42px;
    padding: 4px 13px;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--oryx-color-ink);
  }

  ::placeholder,
  ::slotted(input)::placeholder {
    color: var(--oryx-color-neutral-dark);
  }
`;
