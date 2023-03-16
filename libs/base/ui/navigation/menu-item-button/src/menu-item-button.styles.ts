import { css } from 'lit';

export const styles = css`
  :host {
    min-width: 75px;
    max-width: 154px;
    display: inline-flex;
    flex-direction: column;
  }

  oryx-button {
    flex: 1 0 auto;
  }

  oryx-button > * {
    --oryx-icon-size: 32px;

    display: grid;
    justify-items: center;
    gap: 5px;
    padding: 6px;
    border: solid 2px transparent;
    box-sizing: border-box;
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
