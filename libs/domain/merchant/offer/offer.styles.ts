import { css } from 'lit';

export const merchantOfferStyles = css`
  :host {
    container-type: inline-size;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: var(--oryx-color-neutral-12);
  }

  @container (max-width: 300px) {
    oryx-heading {
      grid-column: 1 / -1;
    }

    oryx-product-price,
    oryx-product-availability {
      grid-column: 1 / -1;
    }
  }

  @container (min-width: 301px) {
    oryx-product-price,
    oryx-product-availability {
      justify-self: end;
    }

    oryx-product-availability {
      grid-column: 2;
    }
  }

  oryx-product-price {
    display: flex;
  }

  oryx-product-price::part(original),
  oryx-product-price::part(sales) {
    font-size: initial;
  }

  .delivery-time {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
