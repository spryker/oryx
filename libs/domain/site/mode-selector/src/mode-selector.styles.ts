import { css } from 'lit';

export const styles = css`
  button {
    color: var(--oryx-color-primary-300);
  }

  button:hover {
    background-color: transparent;
    box-shadow: none;
    border-color: var(--oryx-color-primary-300);
  }

  button:focus-visible {
    outline: solid 1px blue;
  }
`;
