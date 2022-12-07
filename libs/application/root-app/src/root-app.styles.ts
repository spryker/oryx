import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: var(--oryx-typography-font-face);
    font-size: var(--oryx-typography-font-size);
    font-weight: var(--oryx-typography-font-weight);
    letter-spacing: 0.005em;
    color: var(--oryx-color-ink);
    background-color: var(--oryx-color-canvas-100);
  }

  ::placeholder {
    color: var(--oryx-color-placeholder);
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  nav .products {
    display: flex;
    justify-content: right;
    align-items: center;
    flex: 1;
    font-size: 0.8em;
  }

  nav .link {
    margin: 0 12px;
    color: var(--oryx-color-canvas-100, #ffffff);
  }
`;
