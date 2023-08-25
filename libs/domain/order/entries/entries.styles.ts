import { css } from 'lit';

export const orderEntriesStyles = css`
  :host {
    display: grid;
  }

  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-neutral-6);
  }

  oryx-button {
    margin-block-start: 10px;
    margin-inline: auto;
  }
`;
