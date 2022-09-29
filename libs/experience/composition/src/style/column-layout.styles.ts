import { css } from 'lit';

/**
 * the column layout comes in 2 flavours:
 *
 * 1. flexbox driven
 * A single column that allows to distribute the items over the
 * horizontal axes.
 *
 * 2. grid driven
 * Only when there's a column-count > 1, the grid is used. grid items can
 * be organised using col span.
 */

const baseRules = css`
  [class*='column-count-']:not(.column-count-1) {
    display: grid;
    grid-template-rows: repeat(auto-fit, var(--height));
    grid-auto-rows: var(--height, minmax(min-content, max-content));
  }

  [class*='-layout-column']:not([class*='column-count-']) > *,
  .column-count-1 > * {
    flex: var(--fixed, 1 1) var(--width, auto);
  }

  [class*='-column-count-1'] {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const columnLayoutStyles = css`
  ${baseRules};

  .xs-layout-column {
    flex-wrap: nowrap;
  }

  .xs-column-count-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .xs-column-count-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .xs-column-count-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 768px) {
    .md-layout-column {
      flex-wrap: nowrap;
    }

    .md-column-count-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .md-column-count-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .md-column-count-4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .lg-layout-column {
      flex-wrap: nowrap;
    }

    .lg-column-count-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .lg-column-count-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .lg-column-count-4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;
