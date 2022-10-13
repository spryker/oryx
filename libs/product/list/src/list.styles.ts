import { css } from 'lit';

export const ProductListStyles = css`
  :host {
    padding-inline: 4px;
    scroll-padding-inline: 4px;
  }

  :host([class*='layout-carousel']) product-card {
    margin-bottom: 12px;
  }
`;
