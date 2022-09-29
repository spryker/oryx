import { css } from 'lit';

export const baseListStyles = css`
  :host([class*='-layout-carousel']) > product-card {
    scroll-snap-align: start;
    flex: 0 0 calc(100% / var(--carousel-items, 4));
    height: var(--height, initial);
  }
`;
