import { css } from 'lit';

export const styles = css`
  form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 17px;
  }

  oryx-button {
    flex-grow: 1;
  }

  oryx-button button {
    min-width: 175px;
    height: 28px;
  }

  [type='cart-add'] {
    --oryx-icon-size: 24px;
  }
`;
