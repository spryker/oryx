import { css } from 'lit';

export const selectStyles = css`
  :host {
    cursor: pointer;
  }

  slot::slotted(select),
  slot::slotted(input:not([readonly])) {
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
    pointer-events: none;
    font: inherit;
    text-overflow: ellipsis;
    appearance: none;
    /* stylelint-disable */
    /* requires by safari < 15.4 */
    -webkit-appearance: none;
    /* stylelint-enable */
  }

  oryx-icon[type='dropdown'] {
    --oryx-icon-size: var(--oryx-icon-size-medium);
  }

  ::slotted(select:invalid),
  :host(:not([has-value])) ::slotted(select) {
    color: var(--oryx-color-placeholder);
  }
`;
