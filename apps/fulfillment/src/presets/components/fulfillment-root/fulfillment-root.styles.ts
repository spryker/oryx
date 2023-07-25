import { css } from 'lit';

export const styles = css`
  :host {
    font-family: var(--oryx-typography-body-font);
    font-weight: var(--oryx-typography-body-weight);
    box-sizing: border-box;
    min-height: 100vh;
    display: block;
    max-width: var(--oryx-layout-container-width);
    margin: auto;
  }
`;
