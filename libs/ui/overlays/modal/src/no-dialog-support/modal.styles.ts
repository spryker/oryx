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
    top: 0;
    width: 100%;
    max-height: 100vh;
    height: 100vh;
    overflow: none;
    background-color: var(--oryx-modal-background-color);
  }

  dialog {
    overscroll-behavior: none;
    padding: 0;
    border: none;
    margin: 0 auto;
    background: transparent;
    min-width: var(--oryx-modal-min-width);
    max-width: calc(100% - 60px);
  }

  oryx-card {
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
  }

  oryx-card::part(body) {
    overflow: auto;
  }

  div[slot='footer'] {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
`;
