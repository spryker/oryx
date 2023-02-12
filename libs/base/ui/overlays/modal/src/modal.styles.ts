import { css } from 'lit';

export const styles = css`
  dialog {
    overscroll-behavior: none;
    padding: 0;
    border: none;
    background: transparent;
    min-width: var(--oryx-modal-min-width);
    max-width: calc(100% - 60px);
  }

  oryx-card {
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
  }

  dialog::backdrop {
    background: rgba(0 0 0 / 50%);
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

  slot:not([name]) {
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

  oryx-icon-button:first-child button {
    padding: 0;
  }
`;
