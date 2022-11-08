import { css } from 'lit';

export const styles = css`
  :host {
    font-family: var(--oryx-font);
    font-size: var(--oryx-font-size-base);
    font-weight: var(--oryx-font-weight-medium);
    letter-spacing: 0.005em;
    color: var(--oryx-color-ink);
    background-color: var(--oryx-color-canvas);
  }

  @media (max-width: 767px) {
    :host {
      --oryx-font-size-base: 16px;
      --oryx-font-weight-medium: 600;
    }
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
    color: var(--oryx-color-canvas, #ffffff);
  }
`;
