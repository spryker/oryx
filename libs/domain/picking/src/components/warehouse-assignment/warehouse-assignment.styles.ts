import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 20px 30px;
    background: var(--oryx-color-neutral-3);
  }

  h1 {
    font-weight: 600;
    line-height: 24px;
    padding-block-end: 34px;
  }

  h3 {
    font-weight: 500;
    line-height: 24px;
  }

  oryx-button {
    display: block;
  }

  button {
    margin-block-start: 16px;
  }

  hr {
    margin: 16px -30px;
    height: 1px;
    background-color: var(--oryx-color-neutral-5);
    border: none;
  }

  hr:last-child {
    display: none;
  }
`;
