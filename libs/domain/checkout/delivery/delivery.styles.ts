import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const styles = css`
  :host {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr auto;
  }

  h3 {
    ${headingUtil(HeadingTag.H5)};
  }

  oryx-checkout-address {
    grid-column: 1 / -1;
  }
`;
