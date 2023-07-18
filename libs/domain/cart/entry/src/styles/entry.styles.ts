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

  .image {
    grid-row: span 2;
    height: auto;
  }

  oryx-site-price {
    font-size: var(--oryx-typography-h6-size);
    font-weight: var(--oryx-typography-h6-weight);
    line-height: var(--oryx-typography-h6-line);
    align-self: end;
  }

  .item-price {
    font-size: var(--oryx-typography-small-size);
    font-weight: var(--oryx-typography-small-weight);
    line-height: var(--oryx-typography-small-line);
    color: var(--oryx-color-neutral-9);
    display: grid;
    align-items: center;
    grid-auto-flow: column;
    gap: 4px;
  }

  oryx-product-price,
  oryx-product-price::part(sales),
  oryx-product-price::part(original),
  oryx-product-price::part(tax) {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    grid-column: initial;
  }

  oryx-product-price::part(original) {
    grid-column: 2;
  }

  .item-price oryx-product-price {
    gap: inherit;
  }
`;

export const cartEntryStyles = css`
  :host {
    --image-fit: cover;

    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto 1fr;
    column-gap: 16px;
    padding-block: 20px 28px;
  }

  a {
    display: contents;
  }

  oryx-product-media {
    width: 87px;
    aspect-ratio: 1/1;
    margin-inline-start: 20px;
    grid-row: 1 / span 2;
  }

  .details {
    align-content: start;
    gap: 4px;
    grid-row: 1;
    grid-column: 2;
    color: var(--oryx-color-neutral-11);
  }

  oryx-product-id {
    font-size: var(--oryx-typography-small-size);
    font-weight: var(--oryx-typography-small-weight);
    line-height: var(--oryx-typography-small-line);
  }

  oryx-product-id::part(prefix) {
    color: var(--oryx-color-neutral-9);
  }

  section {
    display: grid;
  }

  ${pricing}

  oryx-cart-quantity-input {
    margin-block-end: 14px;
  }

  .actions {
    padding-block-start: 14px;
    grid-row: 2;
    grid-column: 2;
    justify-content: start;
  }

  .actions oryx-button span {
    display: var(--oryx-screen-small-inline, none);
  }
`;
