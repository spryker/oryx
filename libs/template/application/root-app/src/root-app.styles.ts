import { css } from 'lit';

export const styles = css`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

  :host {
    display: block;
    font-family: var(--oryx-typography-font-face);
    font-size: var(--oryx-typography-font-size);
    font-weight: var(--oryx-typography-font-weight);
    line-height: var(--oryx-typography-font-line);
    letter-spacing: 0.005em;
    color: var(--oryx-color-ink);
    background-color: var(--oryx-color-canvas-100);
    min-height: 100vh;
    box-sizing: border-box;
  }

  ::placeholder {
    color: var(--oryx-color-placeholder);
  }
`;
