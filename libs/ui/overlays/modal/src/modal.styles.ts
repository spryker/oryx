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

  div[slot='footer'] {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  oryx-card::part(body) {
    overflow: auto;
  }
`;
