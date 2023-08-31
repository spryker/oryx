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
    width: min(
      calc(100vw - (var(--oryx-container-bleed, 0px) * 2)),
      var(--oryx-modal-width, 100%)
    );
    max-width: calc(100vw - var(--oryx-modal-bleed, 0px) * 2);
    max-height: calc(100vh - var(--oryx-modal-bleed, 0px) * 2);
  }

  dialog[open] {
    display: flex;
    flex-direction: column;
  }

  form {
    display: contents;
  }

  :host([minimal]) dialog {
    min-width: var(--oryx-modal-width, 510px), calc(100vw - 20px);
  }

  :host(:not([minimal])) dialog {
    --oryx-card-border-radius: var(--oryx-modal-radius);

    width: var(--oryx-modal-max-width, var(--oryx-modal-width, 510px));
    min-height: var(--oryx-modal-height, auto);
  }

  oryx-card {
    flex: 1 1;
  }

  :host(:not([minimal])) oryx-card {
    min-height: calc(
      var(--oryx-modal-height, 100%) - var(--oryx-modal-bleed, 0px) * 2
    );
  }

  dialog::backdrop {
    background: var(--oryx-modal-background, rgba(0 0 0 / 50%));
  }

  header,
  footer {
    width: 100%;
    display: flex;
    gap: 10px;
    flex: 1 0;
  }

  header {
    align-items: center;
    justify-content: space-between;
  }

  footer {
    justify-content: flex-end;
  }

  oryx-card::part(body) {
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  oryx-heading {
    flex: 1 0;
  }

  slot[name='navigate-back'] oryx-button {
    margin-inline-start: -7px;
  }

  header > oryx-button {
    margin-inline-end: -7px;
  }

  slot[name='navigation-back'] oryx-button {
    outline: solid 3px red;
  }

  :host([footerButtonFullWidth]) footer oryx-button,
  :host([footerButtonFullWidth]) ::slotted(oryx-button) {
    width: 100%;
  }
`;
