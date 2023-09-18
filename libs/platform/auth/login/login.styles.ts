import { css } from 'lit';

export const styles = css`
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
  }

  oryx-input,
  oryx-password-input,
  oryx-checkbox,
  oryx-notification {
    grid-column: auto / span 2;
  }

  oryx-input,
  oryx-password-input {
    margin-block-start: 10px;
  }
`;
