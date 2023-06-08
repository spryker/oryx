import { css } from 'lit';
export const styles = css`
  :host {
    display: block;
  }

  :host([hasError]) ::slotted(input) {
    border-color: var(--oryx-color-error-9);
  }

  ::slotted(:not(input)) {
    position: relative;
  }

  ::slotted(:is(button, a[href]):not([tabindex='-1'])) {
    position: relative;
    z-index: 1;
  }

  input::after,
  ::slotted(input)::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: 1;
  }

  ::slotted(*) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }

  input,
  ::slotted(input) {
    appearance: none;
    display: block;
    padding: 1px;
    min-width: 40px;
    height: 20px;
    margin: 0;
    background: var(--oryx-color-neutral-9);
    border-radius: 24px;
    border: 1px solid transparent;
    outline: none;
  }

  input:not(:disabled),
  ::slotted(input:not(:disabled)) {
    cursor: pointer;
  }

  input::before,
  ::slotted(input)::before {
    content: '';
    position: relative;
    display: block;
    inset-inline-start: 0;
    width: 16px;
    height: 16px;
    background: var(--oryx-color-neutral-1);
    border-radius: 50%;
    transition: var(--oryx-transition-time);
  }

  input:checked::before,
  ::slotted(input:checked)::before {
    inset-inline-start: calc(100% - 16px);
  }

  input:hover,
  input:active,
  input:focus-visible,
  ::slotted(input:hover),
  ::slotted(input:active),
  ::slotted(input:focus-visible) {
    background: var(--oryx-color-neutral-11);
  }

  input:checked:hover,
  input:checked:active,
  input:checked:focus-visible,
  ::slotted(input:checked:hover),
  ::slotted(input:checked:active),
  ::slotted(input:checked:focus-visible) {
    background: var(--oryx-color-primary-10);
  }

  input:focus-visible,
  input:checked:focus-visible,
  ::slotted(input:focus-visible),
  ::slotted(input:checked:focus-visible) {
    border-color: var(--oryx-color-neutral-1);
    box-shadow: 0 0 3px var(--oryx-color-focus);
  }

  input:checked,
  ::slotted(input:checked) {
    background: var(--oryx-color-primary-9);
  }

  input:disabled,
  input:checked:disabled,
  ::slotted(input:disabled),
  ::slotted(input:checked:disabled) {
    background: var(--oryx-color-neutral-6);
  }

  [hasErrorContent] {
    margin-block-start: 1px;
  }
`;
