import { primaryColorBase } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const styles = css`
  h3 {
    margin-block-end: 20px;
  }

  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-neutral-6);
  }

  oryx-button {
    margin-block-start: 10px;
  }

  button {
    color: ${primaryColorBase};
  }
`;
