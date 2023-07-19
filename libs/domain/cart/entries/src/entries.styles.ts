import { css } from 'lit';

export const cartEntriesStyles = css`
  h1 {
    font-size: var(--oryx-typography-h3-size);
    font-weight: var(--oryx-typography-h3-weight);
    line-height: var(--oryx-typography-h3-line);
    margin-block-end: 20px;
  }

  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-neutral-6);
  }

  oryx-heading {
    text-align: var(--oryx-typography-h1-align);
  }
`;
