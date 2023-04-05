import { css } from 'lit';

export const styles = css`
  h3 {
    margin-block-end: 20px;
  }

  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-canvas-500);
  }

  oryx-button {
    margin-block-start: 10px;
  }

  button {
    color: var(--oryx-color-primary-300);
  }
`;
