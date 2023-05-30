import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: var(--oryx-typography-font-face);
    font-size: var(--oryx-typography-font-size);
    font-weight: var(--oryx-typography-font-weight);
    line-height: var(--oryx-typography-font-line);
    letter-spacing: 0.005em;
    color: var(--oryx-color-neutral-12);
    background-color: var(--oryx-color-neutral-1);
    min-height: 100vh;
    box-sizing: border-box;
  }

  ::placeholder {
    color: var(--oryx-color-placeholder);
  }
`;
