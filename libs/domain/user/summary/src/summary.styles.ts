import { css } from 'lit';

export const styles = css`
  .trigger {
    --oryx-icon-size: 32px;

    display: grid;
    justify-items: center;
    min-width: 71px;
    max-width: 154px;
    gap: 5px;
    padding: 6px;
    border: solid 2px transparent;
  }

  .trigger:hover {
    background-color: var(--oryx-color-primary-400);
    box-shadow: none;
  }

  .trigger:focus-visible {
    border-color: var(--oryx-color-canvas-100);
    outline: solid 1px blue;
    outline-offset: -3px;
  }

  .dropdown-link {
    --oryx-icon-size: 24px;

    justify-content: flex-start;
    padding: 9px 15px;
  }
`;
