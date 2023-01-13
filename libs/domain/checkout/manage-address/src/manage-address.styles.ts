import { css } from 'lit';

export const styles = css`
  oryx-user-address-book {
    display: flex;
    flex-direction: column;
    width: min(100vw, calc(450px - 2 * var(--oryx-card-body-padding, 0px)));
  }
`;
