import { css } from 'lit';

export const styles = css`
  /* Showcasing different layout on desktop */
  .product-preview-wrapper {
    --thumb-width: 32px;
    --thumb-height: 32px;
    --thumb-gap: 16px;
    --preview-height: 350px;
    max-width: 1200px;
    margin: 0 auto;
  }
  @media (min-width: 1024px) {
    .product-preview-wrapper {
      display: flex;
      gap: 1rem;
    }
    .product-preview-wrapper > * {
      flex-grow: 1;
    }
  }
`;
