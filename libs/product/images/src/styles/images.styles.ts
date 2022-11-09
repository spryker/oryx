import { css } from 'lit';
import {
  hasNoMain,
  isDisplayNone,
  isFloating,
  isPosBottom,
  isPosEnd,
  isPosStart,
  isPosTop,
  mainHeight,
} from './constants';
import { mainImageStyles } from './images-main.styles';
import { navigationStyles } from './images-navigation.styles';

/**
 * The layout for the main image and thumbnail navigation is driven by a grid system.
 * The grid rows and columns depend on the dynamic component definition, since the
 * navigation can be put on the top, bottom, start or end.
 *
 * The grid system allows us to render the layout properly in both ltr and rtl direction.
 *
 * When there's no navigation or main image to be rendered, we neutralise the grid system
 * by using a single row/column.
 */
const hostLayout = css`
  :host {
    width: 100%;
  }

  slot {
    display: grid;
    gap: var(--oryx-layout-gap);
    width: var(--product-images-main-width, 100%);
    position: relative;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  slot:not([nav-position]),
  slot${isPosBottom} {
    grid-template-rows: ${mainHeight} min-content;
  }

  slot${isPosTop} {
    grid-template-rows: min-content ${mainHeight};
  }

  slot${isPosStart} {
    grid-template-columns: min-content var(--product-images-main-width, 1fr);
  }

  slot${isPosEnd} {
    grid-template-columns: var(--product-images-main-width, 1fr) min-content;
  }

  slot[without-nav],
  slot${hasNoMain}, slot${isFloating}, slot${isDisplayNone} {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
`;

export const styles = css`
  ${hostLayout}
  ${mainImageStyles}
  ${navigationStyles}
`;
