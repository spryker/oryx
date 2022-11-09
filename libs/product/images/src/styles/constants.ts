import { css, unsafeCSS } from 'lit';
import {
  ProductImagesMainLayout as PIPL,
  ProductImagesNavigationAlignment as PINA,
  ProductImagesNavigationDisplay as PIND,
  ProductImagesNavigationLayout as PINL,
  ProductImagesNavigationPosition as PINP,
} from '../images.model';

export const hasNoMain = unsafeCSS(`[main-layout='${PIPL.None}']`);
export const isMainToggle = unsafeCSS(`[main-layout='${PIPL.Toggle}']`);
export const isPosBottom = unsafeCSS(`[nav-position='${PINP.Bottom}']`);
export const isPosTop = unsafeCSS(`[nav-position='${PINP.Top}']`);
export const isPosStart = unsafeCSS(`[nav-position='${PINP.Start}']`);
export const isPosEnd = unsafeCSS(`[nav-position='${PINP.End}']`);
export const isPosStartOrEnd = unsafeCSS(`:is(${isPosStart}, ${isPosEnd})`);
export const isGrid = unsafeCSS(`[nav-layout='${PINL.Grid}']`);
export const isFloating = unsafeCSS(`[nav-display='${PIND.Floating}']`);
export const isDisplayNone = unsafeCSS(`[nav-display='${PIND.None}']`);
export const isNavAlignCenter = unsafeCSS(`[nav-align='${PINA.Center}']`);
export const isNavAlignEnd = unsafeCSS(`[nav-align='${PINA.End}']`);

export const mainHeight = css`var(--product-images-main-height, 300px)`;
export const thumbWidth = css`var(--product-images-thumb-width, var(--product-images-thumb-height, 80px))`;
export const thumbHeight = css`var(--product-images-thumb-height, var(--product-images-thumb-width, 80px))`;
