import { css } from 'lit';

export const merchantOfferListItemStyles = css`
  :host {
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
    pointer-events: none;
    container-type: inline-size;
  }

  @container (max-width: 300px) {
    .delivery-time {
      grid-row: 2;
    }

    oryx-heading {
      grid-column: 1 / -1;
    }

    oryx-product-price {
      grid-column: 2;
    }
  }

  @container (min-width: 301px) {
    oryx-product-availability {
      justify-self: end;
    }
  }

  oryx-product-price {
    display: flex;
    justify-self: end;
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
