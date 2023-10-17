import { css } from 'lit';

export const styles = css`
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
  }

  oryx-input,
  oryx-password-input {
    margin-block-start: 10px;
  }

  oryx-link {
    align-items: center;
    justify-content: center;
  }

  oryx-button {
    grid-column: var(--oryx-button-span, auto);
  }
`;
