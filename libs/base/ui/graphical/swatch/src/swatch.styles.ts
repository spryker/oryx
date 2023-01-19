import { css } from 'lit';

export const swatchBaseStyle = css`
  :host {
    display: inline-block;
    height: 15px;
    width: 15px;
    aspect-ratio: 1/1;
    outline: 1px solid var(--oryx-color-canvas-500);
    outline-offset: 3px;
    border-radius: 2px;
    background: var(--swatch) center center;
    background-size: cover;
  }
`;
