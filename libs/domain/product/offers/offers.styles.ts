import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const productOffersStyles = css`
  :host {
    display: grid;
    gap: 5px;
  }

  h3 {
    ${headingUtil(HeadingTag.H5)}
  }

  oryx-radio {
    display: flex;
    gap: 10px;
  }

  oryx-site-price {
    margin-inline-start: auto;
  }
`;
