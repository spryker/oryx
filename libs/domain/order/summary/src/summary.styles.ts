import { css } from 'lit';

export const styles = css`
  h2 {
    margin-bottom: 33px;
  }

  .details {
    gap: 10px;
    display: grid;
    align-items: center;
    grid-template-columns: max-content auto;
  }

  .details:first-of-type {
    grid-template-columns: 20px max-content auto;
    gap: 16px 6px;
  }

  .title {
    font-weight: 600;
  }

  hr {
    border: none;
    border-top: 1px solid var(--oryx-color-canvas-300);
    margin: 26px 0 20px;
    outline: none;
  }

  oryx-icon {
    color: var(--oryx-color-neutral-300);
  }
`;
