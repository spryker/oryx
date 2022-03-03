import { css } from 'lit';

export const selectStyles = css`
  :host {
    cursor: pointer;
  }

  ::slotted(select),
  select {
    cursor: pointer;
  }

  ::slotted(input),
  input {
    cursor: inherit;
  }

  ::slotted(select) {
    width: 100%;
    height: 38px;
    padding: 4px 13px;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--oryx-color-ink);
    appearance: none;
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
`;
