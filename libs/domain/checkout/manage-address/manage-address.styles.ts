import { primaryBase } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const styles = css`
  oryx-user-address-book {
    flex-direction: column;
  }

  oryx-user-address-book,
  oryx-user-address-remove {
    display: flex;
    width: min(100vw, calc(450px - 2 * var(--oryx-card-body-padding, 0px)));
  }

  button {
    /* TODO: remove as soon as our system supports cta text button  */
    color: ${primaryBase};
  }
`;
