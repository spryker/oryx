import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const merchantOffersStyles = css`
  h4 {
    ${headingUtil(HeadingTag.H5)}

    width: 100px;
  }

  h5 {
    ${headingUtil(HeadingTag.H6)}
  }

  /* .offer {
    display: grid;
    grid-template-columns: 1fr auto;
    justify-items: start;
    align-items: center;
    gap: 4px;
  } */
  oryx-button {
    justify-self: start;
    /* grid-column: 2 / span 2; */
  }
  oryx-collapsible oryx-radio {
    grid-template-columns: min-content 1fr auto;
  }

  oryx-product-media {
    height: 50px;
    margin-inline-start: 30px;
  }

  oryx-product-price {
    /* justify-self: end; */
    /* grid-column: 2; */
  }

  oryx-product-availability {
    /* grid-column: 1; */
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

  .delivery {
    display: flex;
    gap: 10px;
    grid-column: 2 / span 3;
  }

  a {
    text-decoration: none;
    color: var(--oryx-color-neutral-12);
  }

  .delivery-time {
    --oryx-icon-fill: 1;
    --oryx-icon-weight: 800;

    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
