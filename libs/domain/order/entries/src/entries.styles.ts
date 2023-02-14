import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  button {
    border: none;
    background-color: transparent;
    line-height: 22px;
    color: var(--oryx-color-primary-300);
    font-weight: 500;
    cursor: pointer;
    outline: none;
  }
`;
