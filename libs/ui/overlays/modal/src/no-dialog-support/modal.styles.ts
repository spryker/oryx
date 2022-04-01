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
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: var(--oryx-modal-background-color);
  }

  dialog {
    overscroll-behavior: none;
    margin-bottom: 0;
    padding: 0;
    border: none;
    margin: 0 auto;
    background: transparent;
    min-width: var(--oryx-modal-min-width);
    max-width: calc(100% - 60px);
    max-height: calc(100% - 60px);
  }

  div[slot='footer'] {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
`;
