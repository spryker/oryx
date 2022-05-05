import { css } from 'lit';

export const styles = css`
  /* Showcasing different layout on desktop */
  .product-preview-wrapper {
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
