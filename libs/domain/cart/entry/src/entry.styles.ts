import { css } from 'lit';

export const cartEntryStyles = css`
  :host {
    --image-fit: cover;

    display: grid;
    grid-template-columns: 87px 1fr auto;
    gap: 16px;
    /* padding: 20px 20px 28px; */
    padding-block: 20px 28px;
  }

  :host(:not(:last-of-type)) {
    border-bottom: 1px solid var(--oryx-color-canvas-300);
  }

  .product {
    display: grid;
    grid-template-columns: 100px 1fr;
  }

  oryx-product-media {
    width: 87px;
    height: 87px;
    /* border: solid 1px gray; */
  }

  oryx-product-id {
    font-size: 0.857rem;
  }

  .details {
    align-content: start;
    gap: 4px;
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
    justify-items: end;
  }

  .price oryx-heading {
    margin-top: 14px;
  }

  .actions {
    margin-top: 4px;
  }
  /* oryx-product-media {
    grid-area: 1 / 1 / span 3;
    align-self: start;
  }

  oryx-product-title,
  oryx-product-id,
  .actions {
    grid-column: 2;
  }

  oryx-cart-quantity-input {
    align-self: start;
    grid-column: 3;
    grid-row: 1;
  }

  oryx-product-price {
    align-self: end;
    grid-column: 3;
    grid-row: 3;
  } */
`;
