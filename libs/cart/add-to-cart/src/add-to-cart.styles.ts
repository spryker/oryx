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

  oryx-button button {
    height: 28px;
  }

  oryx-button:nth-of-type(2) {
    margin-inline-end: 10px;
  }
  oryx-button:last-child {
    flex-grow: 1;
  }

  [type='cart-add'] {
    --oryx-icon-size: 24px;
  }
`;
