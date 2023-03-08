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
 *
 * TODO: consider moving to composition/list component(s)
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
    inset-block-start: var(--top, 0px);
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

  :host([layout='list']) ::slotted(*[layout*='column']) {
    --oryx-layout-factor: calc(var(--oryx-layout-cols) / var(--span, 1));
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
    flex-wrap: wrap;
    align-items: var(--align-items, start);
  }

  :host {
    /* move to 0 for plp... */
    flex: 0 1
      min(
        100%,
        calc(
          ((100% - (var(--cols) - 1) * var(--gap, 0px)) / var(--cols)) *
            var(--span, 1) + ((var(--span, 1) - 1) * var(--gap, 0px))
        )
      );
  }

  :host([layout*='column']) ::slotted(*) {
    flex: 0 0
      min(
        100%,
        calc(
          (
              (100% - (var(--nested-cols, var(--cols)) - 1) * var(--gap, 0px)) /
                var(--nested-cols, var(--cols))
            ) * var(--span, 1) + ((var(--span, 1) - 1) * var(--gap, 0px))
        )
      );
  }

  :host([layout]) ::slotted(*[layout*='column']) {
    --cols: calc(
      (
          var(--oryx-layout-cols) /
            (var(--oryx-layout-cols, 12) / var(--oryx-layout-factor, 1))
        ) * var(--span, 1)
    );
  }

  :host([layout*='column']) ::slotted(*:is([layout='flex'], [layout='list'])) {
    --nested-cols: var(--oryx-layout-cols);
  }

  :host([layout*='column'])
    ::slotted(*:is([layout='carousel'], [layout='text'])) {
    --nested-cols: var(--span, 1);
  }

  :host([layout*='column']) ::slotted(*[layout='grid']) {
    --nested-cols: calc(
      var(--oryx-layout-cols) /
        var(--nested-layout-factor, var(--oryx-layout-factor))
    );
  }

  :host([layout*='column'])
    ::slotted(*:is([layout='grid'], [layout='carousel'], [layout='text'])) {
    --nested-layout-factor: var(--oryx-layout-factor);
  }

  /* TODO: we can maybe simplify and align with other nested refactors */
  :host([layout*='column'])
    ::slotted(*:is([layout='carousel'], [layout='text'])) {
    flex: 0 0
      min(
        100%,
        calc(
          (100% - ((var(--oryx-layout-cols) - 1) * var(--gap, 0px))) /
            var(--oryx-layout-factor) * var(--span, 1) +
            ((var(--span, 1) - 1) * var(--gap, 0px))
        )
      );
  }
`;

const twoColumnLayout = css`
  :host([layout='two-column']) {
    --gap: var(--oryx-layout-column-two-gap);
  }

  :host([layout='two-column']) ::slotted(*:nth-child(odd)) {
    --span: var(--oryx-layout-column-two-span);
  }

  :host([layout='two-column']) ::slotted(*:nth-child(even)) {
    flex-grow: 1;
  }

  :host([layout='two-column']) ::slotted(*:nth-child(odd)[layout='column']) {
    --nested-cols: var(--oryx-layout-column-two-span);
  }

  :host([layout='two-column']) ::slotted(*:nth-child(even)[layout='column']) {
    --nested-cols: calc(
      var(--oryx-layout-cols, 12) - var(--oryx-layout-column-two-span)
    );
  }
`;

/**
 * The flex layout does not have a column size applied. The items are freely rendered over the horizontal axes
 * without wrapping to the next row.
 */
const flexLayout = css`
  :host([layout='flex']) {
    display: flex;
    flex-wrap: wrap;
    align-items: var(--align-items, start);
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
    display: grid;
    flex-basis: inherit;
    grid-template-columns: repeat(
      var(--cols, auto-fill),
      var(--item-size, 1fr)
    );
  }

  :host([layout='grid'][vertical]) {
    grid-template-rows: repeat(
      var(--cols, auto-fill),
      minmax(var(--item-size), 1fr)
    );
    grid-auto-flow: column;
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
    display: grid;
    grid-auto-columns: var(
      --item-size,
      calc(
        (100% - var(--gap, 0px) * (var(--nested-cols, var(--cols)) - 1)) /
          var(--nested-cols, var(--cols))
      )
    );

    grid-auto-flow: column;
    overflow: auto hidden;
    overscroll-behavior-x: contain;
    scroll-snap-type: both mandatory;
    scroll-behavior: smooth;
    scroll-padding-inline-start: var(--scroll-start, 0px);
  }

  :host([layout='carousel'])::-webkit-scrollbar {
    display: none;
  }

  :host([vertical][layout='carousel']) {
    overflow: hidden auto;
    grid-column: auto;
    grid-auto-flow: row;
    scroll-padding-block-start: var(--scroll-start, 0px);
  }

  :host([layout='carousel']) ::slotted(*) {
    scroll-snap-align: start;
  }
`;

/**
 * The text layout
 */
const textLayout = css`
  :host([layout='text']) {
    display: block;
    column-count: var(--cols, 1);
  }
  :host([layout='text']) ::slotted(*:first-child) {
    margin-block-start: 0;
  }
`;

/**
 * The tabular layout
 */
const tabularLayout = css`
  :host([layout='tabular']) {
    display: grid;
    position: relative;
  }

  :host([layout='tabular']:not([orientation='vertical'])) {
    grid-template-areas: 'head foot';
  }

  :host([layout='tabular']) ::slotted(*:not(label):not(input)) {
    position: initial;
  }

  :host([layout='tabular']) ::slotted(*:not(label):not(input)):before {
    content: '';
    border-top: 2px solid var(--oryx-color-canvas-500);
    position: absolute;
    width: 100%;
    margin-top: -2px;
  }

  :host([layout='tabular']:not([orientation='vertical'])) ::slotted(label) {
    grid-row: 1;
    padding-inline: 24px;
    min-height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([layout='tabular']) ::slotted(label) {
    padding-block: 5px;
    border-bottom: solid 2px var(--oryx-color-canvas-500);
    color: var(--oryx-color-neutral-300);
    z-index: 1;
    cursor: pointer;
    transition: all 0.3s;
  }

  :host([layout='tabular']) ::slotted(label:hover) {
    color: var(--oryx-color-ink);
    border-color: var(--oryx-color-neutral-300);
  }

  :host([layout='tabular']) ::slotted(input) {
    appearance: none;
    pointer-events: none;
    outline: none;
  }

  :host([layout='tabular']:not([orientation='vertical']))
    ::slotted(*:not(input):not(label)) {
    grid-row: 2;
    grid-column: 1 / -1;
  }

  :host([layout='tabular']:not([tab-align])) {
    grid-template-columns: repeat(var(--item-count), auto) 1fr;
  }

  :host([layout='tabular'][tab-align='full-width'])
    ::slotted(*:not(input):not(label)) {
    grid-column: 1 / span var(--item-count, -1);
  }

  :host([layout='tabular'][tab-align='start']) {
    grid-template-columns: repeat(var(--max-tabs, 10), auto) 1fr;
  }

  :host([layout='tabular'][tab-align='center']) {
    grid-template-columns: 1fr repeat(var(--max-tabs, 10), auto) 1fr;
  }

  :host([layout='tabular'][tab-align='center']) ::slotted(label:first-of-type) {
    grid-column: 2;
  }

  :host([layout='tabular'][tab-align='center'])
    ::slotted(label:nth-of-type(n + 2)) {
    grid-column: span 1 / calc(-1 * var(--max-tabs, 10));
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
  }

  :host,
  ::slotted(*) {
    transform: rotate(var(--rotate));
  }

  :host([layout]) {
    gap: var(--gap, 0);
    align-items: var(--align-items, start);
  }

  ::slotted(*) {
    --span: 1;
    align-self: var(--align-items, start);
  }

  :host([layout]),
  ::slotted(*) {
    box-sizing: border-box;
    grid-column: auto / span var(--span, 1);
  }

  :host([layout]:not([layout*='column']))
    ::slotted(*[layout]:not([layout*='column'])) {
    --cols: var(--span, 1);
  }

  :host([layout]) ::slotted(*[has-layout]),
  :host([layout]) ::slotted(*[layout]) {
    --cols: var(--span, 1);
  }

  :host([maxWidth]),
  :host([layout]) ::slotted(*[maxWidth]),
  :host([layout]) ::slotted(*[class*='maxWidth']) {
    flex-grow: 1;
  }

  ${containerLayout}
  ${flexLayout}
  ${columnLayout}
  ${listLayout}
  ${gridLayout}
  ${carouselLayout}
  ${textLayout}
  ${twoColumnLayout}
  ${tabularLayout}
  ${stickyLayout}
`;
