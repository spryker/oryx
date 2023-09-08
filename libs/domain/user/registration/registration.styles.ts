import { css } from 'lit';

export const styles = css`
  oryx-notification {
    margin-block-end: 15px;
  }

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap, 15px);
  }

  oryx-input:last-of-type,
  oryx-password-input,
  .agreement,
  oryx-button {
    grid-column: span 2;
  }

  .agreement {
    display: inline-flex;
    align-items: center;
  }

  oryx-button {
    width: 207px;
  }
`;
