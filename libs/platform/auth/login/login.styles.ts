import { css } from 'lit';

export const styles = css`
  :host {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
  }

  oryx-heading,
  form,
  oryx-input,
  oryx-password-input,
  oryx-checkbox,
  oryx-notification,
  p {
    grid-column: auto / span 2;
  }

  h1 {
    margin-block-end: 10px;
  }

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

  h2 {
    margin-block-start: 30px;
  }

  p {
    margin-block-start: 0;
    margin-block-end: 10px;
  }
`;
