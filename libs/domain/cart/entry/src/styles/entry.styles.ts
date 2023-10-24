import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

const pricing =
  featureVersion >= '1.2'
    ? css`
        section.pricing {
          display: grid;
          grid-row: 1 / span 2;
          grid-column: 3;
          justify-items: end;
          padding-inline-end: 20px;
        }

        .image {
          grid-row: span 2;
          height: auto;
        }

        oryx-site-price.subtotal {
          ${headingUtil(HeadingTag.H6)}

          align-self: end;
        }

        .unit-price {
          ${headingUtil(HeadingTag.Small)}

          color: var(--oryx-color-neutral-9);
          display: grid;
          align-items: center;
          grid-auto-flow: column;
          gap: 4px;
        }
      `
    : css`
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

/**
 * We change a couple of small styles in 2.0.0 since the underlying components have changed. The main difference is that
 * we now use the `oryx-site-price` component instead of the `oryx-product-price` component. The price component is now
 * now equipped to handle discounted and from prices, with the associated styling (highlight color or strikethrough).
 */
export const cartEntryStyles = css`
  :host {
    --image-fit: contain;

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

  oryx-product-id::part(prefix),
  oryx-merchant-sold-by::part(prefix) {
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
