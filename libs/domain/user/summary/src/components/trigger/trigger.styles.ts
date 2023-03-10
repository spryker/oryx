import { css } from 'lit';

export const triggerStyles = css`
  oryx-button > * {
    --oryx-icon-size: 32px;

    display: grid;
    justify-items: center;
    min-width: 71px;
    max-width: 154px;
    gap: 5px;
    padding: 6px;
    border: solid 2px transparent;
  }

  oryx-button > :hover {
    background-color: var(--oryx-color-primary-400);
    box-shadow: none;
  }

  oryx-button > :focus-visible {
    border-color: var(--oryx-color-canvas-100);
    outline: solid 1px blue;
    outline-offset: -3px;
  }

  oryx-heading {
    display: var(--oryx-screen-small-hide, initial);
  }
`;
