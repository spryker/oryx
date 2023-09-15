import { css } from 'lit';

export const styles = css`
  :host {
    margin: 30px 18px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--gap, 18px);
  }

  .options {
    display: flex;
    align-items: center;
  }

  .options oryx-link {
    margin-inline-start: auto;
  }

  h1 {
    margin-block-end: 32px;
  }

  h2 {
    margin-block-start: 50px;
    margin-block-end: 20px;
  }

  p {
    margin-block-end: 30px;
  }

  oryx-notification {
    margin-block-end: 20px;
  }
`;
