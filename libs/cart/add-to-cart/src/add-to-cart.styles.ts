import { css } from 'lit';

export const styles = css`
  form {
    display: flex;
  }

  input[type='number'] {
    appearance: textfield;
    width: 100px;
    text-align: center;
  }

  oryx-input {
    margin-inline: 5px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
  }

  oryx-button:first-child button,
  oryx-button:nth-child(3) button {
    height: 28px;
  }

  oryx-button:last-child {
    flex-grow: 1;
    margin-inline-start: 10px;
  }
`;
