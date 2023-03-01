import { css } from 'lit';

export const NDSStyles = css`
  :host {
    display: none;
  }

  :host([open]) {
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 999;
    inset-inline-start: 0;
    inset-block-start: 0;
    width: 100%;
    max-height: 100vh;
    height: 100vh;
    overflow: none;
    background-color: var(--oryx-modal-background-color);
  }

  dialog {
    margin: 0 auto;
  }
`;
