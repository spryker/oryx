import { css } from 'lit';

export const searchRangeFacetStyles = css`
  oryx-search-facet-value-navigation > section {
    display: grid;
    grid-template-columns: 1fr min-content 1fr;
    align-items: center;
    gap: 16px 12px;
  }

  oryx-multi-range {
    grid-column: 1 / span 3;
  }
`;
