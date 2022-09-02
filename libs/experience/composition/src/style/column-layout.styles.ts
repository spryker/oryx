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
export const columnLayoutStyles = css`
  .layout-column {
    flex-wrap: nowrap;
  }

  :host([class*='column-count-']:not(.column-count-1)) {
    display: grid;
    grid-template-rows: repeat(auto-fit, var(--height));
    grid-auto-rows: var(--height, minmax(min-content, max-content));
  }

  .column-count-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .column-count-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .column-count-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .layout-column:not([class*='column-count-']) > *,
  .column-count-1 > * {
    flex: var(--fixed, 1 1) var(--width, auto);
  }
`;
