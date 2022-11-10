import { css } from 'lit';
import {
  hasNoMain,
  isFloating,
  isGrid,
  isNavAlignCenter,
  isNavAlignEnd,
  isPosBottom,
  isPosEnd,
  isPosStart,
  isPosStartOrEnd,
  mainHeight,
  thumbHeight,
  thumbWidth,
} from './constants';

const carouselNavigation = css`
  :not(${isGrid}) .nav {
    min-width: 0;
    overflow: auto;
    scroll-behavior: smooth;
  }

  :not(${isGrid}):not(${isPosStartOrEnd}) .nav {
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
  }

  :not(${isGrid})${isPosStartOrEnd} .nav {
    overscroll-behavior-y: contain;
    scroll-snap-type: y mandatory;
  }

  slot${isPosStartOrEnd}:not(${isGrid}) .nav {
    height: inherit;
  }
`;

const gridNavigation = css`
  slot:not(${isPosStartOrEnd})${isGrid} .nav {
    flex-wrap: wrap;
  }

  slot${isGrid} {
    align-items: start;
  }

  slot${isPosStartOrEnd}${isGrid} .nav {
    display: grid;
    grid-template-rows: repeat(var(--oryx-grid-items-per-column, 3), 1fr);
    grid-auto-flow: column;
    min-width: 0;
  }
`;

/**
 * Floating navigations are not based on a grid layout, and force the navigation
 * to float on top of the main image.
 */
const floatingNavigation = css`
  slot${isFloating} {
    overflow: hidden;
  }

  slot${isFloating}:not(${hasNoMain}) .nav {
    position: absolute;
    z-index: 1;
  }

  slot${isFloating}:not(${isPosStartOrEnd}) .nav {
    width: inherit;
  }

  slot${isFloating}${isPosEnd} .nav {
    inset-inline-end: 0;
  }

  slot${isFloating}:not([nav-position]) .nav,
  slot${isFloating}${isPosBottom} .nav {
    bottom: 0;
  }
`;

/**
 * The navigation can be aligned in 3 directions: start, center and end. The alignment
 * is either on the horizontal or vertical axes, depending on the top/bottom or start/end
 * position.
 */
const navigationAlignment = css`
  slot:not(${isGrid}):not(${isPosStartOrEnd}):not([nav-align])
    label:first-child,
  slot:not(${isGrid}):not(${isPosStartOrEnd}):is(${isNavAlignCenter},
      ${isNavAlignEnd})
    label:first-child {
    margin-inline-start: auto;
  }

  slot:not(${isGrid}):not(${isPosStartOrEnd}):not([nav-align]) label:last-child,
  slot:not(${isGrid}):not(${isPosStartOrEnd})${isNavAlignCenter}
    label:last-child {
    margin-inline-end: auto;
  }

  slot:not(${isGrid})${isPosStartOrEnd}:is(${isNavAlignCenter}, ${isNavAlignEnd})
    label:first-child {
    margin-block-start: auto;
  }

  slot:not(${isGrid})${isPosStartOrEnd}${isNavAlignCenter} label:last-child {
    margin-block-end: auto;
  }

  slot${isGrid}:not([nav-align]) .nav,
  slot${isGrid}${isNavAlignCenter} .nav {
    justify-content: center;
  }

  slot${isPosStartOrEnd}${isGrid}:not([nav-align]) .nav,
  slot${isPosStartOrEnd}${isGrid}${isNavAlignCenter} .nav {
    align-self: center;
  }

  slot${isGrid}${isNavAlignEnd} .nav {
    justify-content: end;
    align-self: end;
  }
`;

export const navigationStyles = css`
  .nav {
    display: flex;
    align-items: center;
    align-content: start;
    gap: var(--product-images-navigation-gap, var(--oryx-space-2));
    border: none;
    margin: 0;
    box-sizing: border-box;
    padding: 4px;
  }

  slot${isPosStartOrEnd} .nav {
    flex-direction: column;
    box-sizing: border-box;
  }

  slot${isPosStart}, slot${isPosEnd} {
    height: ${mainHeight};
  }

  ${carouselNavigation}
  ${gridNavigation}
  ${floatingNavigation}
  ${navigationAlignment}

  .nav label {
    position: relative;
    scroll-snap-align: start;
    height: ${thumbHeight};
    width: ${thumbWidth};
    padding: 10px;
    box-sizing: border-box;
    background-color: var(--oryx-color-canvas);
  }

  slot${isPosStartOrEnd} .nav label {
    flex: 0 0 ${thumbHeight};
  }

  slot:not(${isPosStartOrEnd}) .nav label {
    flex: 0 0 ${thumbWidth};
  }

  .nav input {
    appearance: none;
    margin: 0;
    inset: 0;
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    outline: none;
    border-radius: 2px;
  }

  .nav input:focus:focus-visible,
  .nav input:checked,
  .nav input:hover {
    border: solid var(--oryx-border-thin) var(--oryx-color-neutral-darker);
  }

  .nav input:hover:not(:checked) {
    border-color: var(--oryx-color-neutral);
  }

  .nav input:focus:focus-visible {
    box-shadow: 0 0 4px var(--oryx-color-focus);
    border-color: var(--oryx-color-focus);
  }
`;
