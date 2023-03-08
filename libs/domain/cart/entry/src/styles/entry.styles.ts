import { css } from 'lit';

export const cartEntryStyles = css`
  :host {
    --image-fit: cover;

    display: grid;
    grid-template-columns: 107px 1fr auto;
    grid-template-rows: auto 1fr;
    column-gap: 16px;
    padding-block: 20px 28px;
  }

  :host {
    border-bottom: 1px solid var(--oryx-color-canvas-300);
  }

  .product {
    display: grid;
    grid-template-columns: 100px 1fr;
  }

  oryx-product-media {
    width: 87px;
    aspect-ratio: 1/1;
    margin-inline-start: 20px;
  }

  oryx-product-id {
    font-size: 0.857rem;
  }

  .details {
    align-content: start;
    gap: 4px;
    grid-row: 1;
    grid-column: 2;
  }

  .details,
  .price {
    display: grid;
  }

  .actions,
  oryx-product-price {
    display: grid;
    grid-auto-flow: column;
  }

  oryx-product-price,
  oryx-product-price::part(original) {
    font-weight: inherit;
    color: inherit;
    font-size: 0.857rem;
  }

  oryx-product-price {
    display: contents;
  }

  oryx-product-media,
  .price {
    grid-row: 1 / span 2;
  }

  .item-price {
    color: var(--oryx-color-neutral-300);
    display: grid;
    align-items: center;
    grid-auto-flow: column;
    gap: 4px;
  }

  oryx-product-price::part(original) {
    grid-column: 2;
  }

  .price {
    grid-column: 3;
    justify-items: end;
    padding-inline-end: 20px;
  }

  oryx-cart-quantity-input {
    margin-block-end: 14px;
  }

  .actions {
    padding-top: 14px;
    grid-row: 2;
    grid-column: 2;
  }
`;
