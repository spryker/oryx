import { screenCss } from '@spryker-oryx/utilities';
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

  :host([minimal]) dialog {
    width: var(--oryx-modal-width, 510px);
  }

  :host(:not([minimal])) dialog {
    --oryx-card-border-radius: var(--oryx-modal-radius);

    width: var(--oryx-modal-max-width, var(--oryx-modal-width, 510px));
    min-height: var(--oryx-modal-height, auto);
  }

  :host(:not([minimal])) oryx-card {
    margin-block-start: var(--oryx-modal-bleed, 0);
    min-height: calc(
      var(--oryx-modal-height, auto) - var(--oryx-modal-bleed, 0px) * 2
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

export const screenStyles = screenCss({
  sm: css`
    oryx-button {
      --oryx-button-height: 38px;
      --oryx-icon-size: var(--oryx-icon-size-lg);
    }
  `,
});
