import { css } from 'lit';

export const cartEntriesStyles = css`
  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-neutral-6);
  }
`;
