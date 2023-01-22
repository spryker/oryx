import { css } from 'lit';

/**
 * The layout supports a container setup, to limit the maximum size of the layout. The size is driven
 * by a design token.
 *
 * Additionally, the layout can leverage a `maxWidth` property, so that a container can leverage a background
 * that uses the full width of the page. This effect is known as jumbotron effect.
 *
 * The jumbotron effect requires an alternative setup for the auto-margin that you'd normally apply to a container.
 * Instead, we calculate an inline padding, so that the background can be leveraged.
 */
const containerLayout = css`
  :host([container]:not([layout])) {
    display: block;
  }

  :host([container]:not([maxWidth])) {
    margin-inline: auto;
    width: 100%;
    max-width: min(
      calc(100% - (2 * var(--oryx-layout-container-padding))),
      var(--oryx-layout-container-width)
    );
  }

  :host([container][maxWidth]) {
    padding-inline: max(
      var(--oryx-layout-container-padding),
      calc((100% - var(--oryx-layout-container-width)) / 2)
    );
  }
`;

const stickyLayout = css`
  :host([sticky]),
  ::slotted(*[sticky]),
  ::slotted([class*='sticky']) {
    position: sticky;
    top: var(--top, 0px);
    max-height: calc(var(--height) - var(--top, 0px));
    z-index: var(--z-index, 1);
  }
`;

/**
 * The list layout uses a single column layout, where all items are taken 100% of the width
 * of the layout.
 */
const listLayout = css`
  :host([layout='list']) {
    display: flex;
    flex-direction: column;
  }

  :host([layout='list']) ::slotted(*) {
    width: 100%;
  }
`;

/**
 * Columns will by default neglect the calculated columns that are used for grids/carousels (i.e. 12/3=4 columns),
 * to that reason we reset the layout factor to `1`. However, when the column layout contains nested grids or carousels,
 * we need revamp the layout factor from the design token (`--oryx-layout-factor`).
 */
const columnLayout = css`
  :host([layout*='column']) {
    --nested-layout-factor: 1;

    display: flex;
    align-items: var(--align-items, start);
    flex-wrap: wrap;
  }

  :host([layout*='column']) ::slotted(*[layout='grid']),
  :host([layout*='column']) ::slotted(*[layout='carousel']) {
    --nested-layout-factor: var(--oryx-layout-factor);
  }

  :host([layout]) ::slotted(*[layout*='column']) {
    --cols: calc(
      (
          var(--oryx-layout-cols) /
            (var(--oryx-layout-cols, 12) / var(--oryx-layout-factor, 1))
        ) * var(--span, 1)
    );
  }

  :host,
  :host([layout*='column']) ::slotted(*) {
    flex: 0 0
      min(
        100%,
        calc(
          ((100% - (var(--cols) - 1) * var(--gap, 0px)) / var(--cols)) *
            var(--span, 1) + ((var(--span, 1) - 1) * var(--gap, 0px))
        )
      );
  }

  :host([layout='two-column']) {
    --gap: var(--oryx-layout-column-two-gap);
  }

  :host([layout='two-column']) ::slotted(*:nth-child(odd)) {
    --span: var(--oryx-layout-column-two-span);
  }
  :host([layout='two-column']) ::slotted(*:nth-child(even)) {
    flex-grow: 1;
  }
`;

/**
 * The flex layout does not have a column size applied. The items are freely rendered over the horizontal axes
 * without wrapping to the next row.
 */
const flexLayout = css`
  :host([layout='flex']) {
    display: flex;
    align-items: var(--align-items, start);
    flex-wrap: wrap;
  }

  :host([layout='flex']) ::slotted(*) {
    flex: 0 0 auto;
  }
`;

/**
 * The grid layout specifies the column size for each configured column. The column configuration defaults
 * to a calculated column count.
 *
 * When the grid is nested in a columns layout, it redefines the columns to avoid reflecting the redefined
 * column from the inherited column layout
 */
const gridLayout = css`
  :host([layout='grid']) {
    grid-template-columns: repeat(var(--cols), 1fr);
  }

  :host([layout*='column']) ::slotted(*[layout='grid']) {
    grid-template-columns: repeat(
      calc(
        var(--oryx-layout-cols, 12) /
          (var(--oryx-layout-cols, 12) / var(--span, 1))
      ),
      1fr
    );
  }
`;

/**
 * The carousel layout specifies the column size for each configured column, similar to the grid layout.
 * The technique is different though, as the carousel grid items will render infinitely over the x-axes.
 * The column configuration defaults to a calculated column count.
 *
 * When the carousel is nested in a columns layout, it redefines the columns to avoid reflecting the redefined
 * column from the inherited column layout
 */
const carouselLayout = css`
  :host([layout='carousel']) {
    grid-auto-columns: calc(
      (100% - var(--gap, 0px) * (var(--nested-cols, var(--cols)) - 1)) /
        var(--nested-cols, var(--cols))
    );
    grid-auto-flow: column;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scroll-padding-inline-start: var(--padding-inline, 0px);
  }

  :host([layout='carousel']) ::slotted(*) {
    scroll-snap-align: start;
  }

  :host([layout*='column']) ::slotted(*[layout='carousel']) {
    --nested-cols: var(--span, 1);
  }
`;

/**
 * The layout system is based on a column based system. This system is defined by design tokens, to specify
 * the number of columns (`--oryx-layout-cols`). The design system also factors in a so-called layout-factor
 * (`--oryx-layout-factor`) to recalculate the columns towards a grid or carousel layout.
 *
 * By default, the column count defaults to:
 * - large screen: 12 columns, refactored (3) to 4 columns for grid/carousel
 * - medium screen: 8 columns, refactored (4) to 2 columns for grid/carousel
 * - small screen: 4 columns, refactored (4) to 1 columns for grid/carousel
 *
 * The design tokens can be configured to customise the system.
 */

/* redefine the column system to reflect nested setup  */
export const layoutStyles = css`
  :host {
    --cols: calc(
      var(--oryx-layout-cols, 12) /
        var(--nested-layout-factor, var(--oryx-layout-factor, 1))
    );

    padding-inline: var(--padding-inline, initial);
  }

  :host,
  ::slotted(*) {
    transform: rotate(var(--rotate));
  }

  :host([layout]) {
    display: grid;
    align-items: var(--align-items, start);
    gap: var(--gap, 0);
  }

  ::slotted(*) {
    --span: 1;
    align-self: var(--align-items, start);
  }

  :host([layout]),
  ::slotted(*) {
    box-sizing: border-box;
    grid-column: var(--grid-column, auto) / span
      min(calc(var(--cols) - (var(--grid-column, 1) - 1)), var(--span));
    grid-row: var(--grid-row, auto);
  }

  :host([layout]:not([layout*='column']))
    ::slotted(*[layout]:not([layout*='column'])) {
    --cols: var(--span, 1);
  }

  :host([layout]) ::slotted(*[has-layout]) {
    --cols: var(--span, 1);
  }

  :host([maxWidth]),
  :host([layout]) ::slotted(*[maxWidth]),
  :host([layout]) ::slotted(*[class*='maxWidth']) {
    flex-grow: 1;
  }

  ${listLayout}
  ${containerLayout}
  ${columnLayout}
  ${flexLayout}
  ${gridLayout}
  ${carouselLayout}
  ${stickyLayout}
`;
