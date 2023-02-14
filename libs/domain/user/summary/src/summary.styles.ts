import { css } from 'lit';

export const styles = css`
  a {
    --oryx-icon-size: 32px;

    display: grid;
    justify-items: center;
    min-width: 71px;
    max-width: 154px;
    gap: 5px;
    padding: 6px;
    border: solid 2px transparent;
  }

  a:hover {
    background-color: var(--oryx-color-primary-400);
    box-shadow: none;
  }

  a:focus-visible {
    border-color: var(--oryx-color-canvas-100);
    outline: solid 1px blue;
    outline-offset: -3px;
  }
`;
