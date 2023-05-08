import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-card-header-padding: var(--oryx-modal-header-padding, 18px 30px);
    --oryx-card-body-padding: var(--oryx-modal-body-padding, 18px 30px);
    --oryx-card-footer-padding: var(--oryx-modal-footer-padding, 0 30px);
  }

  dialog {
    overscroll-behavior: none;
    padding: 0;
    border: none;
    background: transparent;
    min-width: var(--oryx-modal-min-width, 330px);
    max-width: calc(var(--oryx-layout-container-width, 100%) - 60px);
  }

  oryx-card {
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
  }

  dialog::backdrop {
    background: var(--oryx-modal-background, rgba(0 0 0 / 50%));
  }

  header,
  footer {
    width: 100%;
    display: flex;
    gap: 10px;
  }

  header {
    align-items: center;
    justify-content: space-between;
  }

  footer {
    justify-content: flex-end;
  }

  slot[name="heading"],
  slot[name="footer"] {
    display: flex;
    flex: 1 0;
  }

  oryx-card::part(body) {
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  oryx-heading {
    flex: 1 0;
  }

  slot[name="navigation-back"] button {
    padding: 0;
  }

  :host([footerButtonFullWidth]) footer oryx-button,
  :host([footerButtonFullWidth]) ::slotted(oryx-button) {
    width: 100%;
  }
`;
