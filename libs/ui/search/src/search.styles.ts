import { css } from 'lit';

export const searchStyles = css`
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    transition: opacity var(--oryx-transition-time, 0.3s);
  }

  button[disabled] {
    cursor: default;
  }

  button:not([disabled]):hover {
    color: var(--oryx-color-neutral-darker);
  }

  button.clear {
    opacity: 0%;
    padding-inline-end: 14px;
  }

  :host(:not(.suffix-fill)) button.clear + slot[name='suffix'] {
    margin-inline-start: -4px;
  }

  :host(.has-value) button.clear {
    opacity: 100%;
  }
`;
