import { screenCss } from '@spryker-oryx/utilities';
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

  span {
    display: block;
    width: 8px;
    height: 2px;
    background-color: var(--oryx-color-neutral-9);
    align-self: end;
    margin-block-end: 22px;
  }
`;

const largeScreen = css`
  span {
    margin-block-end: 19px;
  }
`;

export const screenStyles = screenCss({
  lg: largeScreen,
});
