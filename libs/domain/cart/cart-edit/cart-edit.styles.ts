import { css } from 'lit';

export const styles = css`
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 20px 0;
  }

  oryx-input {
    grid-column: 1 / span 2;
  }

  oryx-button {
    grid-column: 1;
    margin-block-start: 20px;
  }
`;
