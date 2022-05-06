import { css } from 'lit';

export const selectStyles = css`
  :host {
    cursor: pointer;
  }

  slot::slotted(select),
  slot::slotted(input[readonly]) {
    cursor: pointer;
    background-color: transparent;
  }

  ::slotted(input),
  input {
    cursor: inherit;
  }

  ::slotted(select) {
    width: 100%;
    height: 38px;
    padding: 7px 11px;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--oryx-color-ink);
    appearance: none;
    font: inherit;
    text-overflow: ellipsis;
  }

  button.dropdown {
    margin-inline-end: -18px;
    color: var(--oryx-color-neutral-dark);
  }

  :host([disabled]) button.dropdown {
    color: var(--oryx-color-neutral-darker);
  }

  oryx-icon[type='dropdown'] {
    --oryx-icon-size: var(--oryx-icon-size-medium);
  }

  ::slotted(select:invalid) {
    color: var(--oryx-color-placeholder);
  }
`;
