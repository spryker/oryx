import { css } from 'lit';

const pricing = css`
  section.pricing {
    display: grid;
    grid-row: 1 / span 2;
    grid-column: 3;
    justify-items: end;
    padding-inline-end: 20px;
  }

  oryx-product-price,
  oryx-product-price::part(original) {
    color: inherit;
  }

  oryx-product-price {
    display: contents;
  }

  .entry-price {
    font-size: var(--oryx-typography-h6-size);
    font-weight: var(--oryx-typography-h6-weight);
    line-height: var(--oryx-typography-h6-line);
  }

  .item-price {
    font-size: var(--oryx-typography-small-size);
    font-weight: var(--oryx-typography-small-weight);
    line-height: var(--oryx-typography-small-line);
    color: var(--oryx-color-neutral-300);
    display: grid;
    align-items: center;
    grid-auto-flow: column;
    gap: 4px;
  }

  oryx-product-price,
  oryx-product-price::part(sales),
  oryx-product-price::part(original) {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    grid-column: initial;
  }

  .item-price oryx-product-price {
    gap: inherit;
  }
`;

export const cartEntryStyles = css`
  :host {
    --image-fit: cover;

    display: grid;
    grid-template-columns: 107px 1fr auto;
    grid-template-rows: auto 1fr;
    column-gap: 16px;
    padding-block: 20px 28px;
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

  section {
    display: grid;
  }

  ${pricing}

  section.actions {
    display: grid;
    grid-auto-flow: column;
  }

  oryx-product-media {
    grid-row: 1 / span 2;
  }

  oryx-cart-quantity-input {
    margin-block-end: 14px;
  }

  .actions {
    padding-top: 14px;
    grid-row: 2;
    grid-column: 2;
    justify-content: start;
  }
`;
