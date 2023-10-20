import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const productOffersStyles = css`
  h4 {
    ${headingUtil(HeadingTag.H5)}

    width: 100px;
  }

  .offer {
    display: grid;
    grid-template-columns: 1fr auto;
    justify-items: start;
    gap: 4px;
  }

  oryx-product-media {
    height: 70px;
    margin-inline-start: 30px;
  }

  oryx-product-availability {
    grid-column: 1;
  }
  oryx-radio {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 5px;
  }

  oryx-button::part(button) {
    padding-inline: 0 5px;
  }

  h5 {
    ${headingUtil(HeadingTag.H6)}
  }

  .details {
    display: flex;
    justify-content: space-between;
  }

  oryx-product-price {
    display: flex;
  }

  oryx-product-price::part(original),
  oryx-product-price::part(sales) {
    font-size: initial;
  }
`;
