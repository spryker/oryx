import { css } from 'lit';

export const NDSStyles = css`
  :host {
    --oryx-card-header-padding: var(--oryx-modal-header-padding);
    --oryx-card-body-padding: var(--oryx-modal-body-padding);
    --oryx-card-footer-padding: var(---oryx-modal-footer-padding);
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
