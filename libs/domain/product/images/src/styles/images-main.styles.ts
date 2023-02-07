import { css } from 'lit';
import { isMainToggle, mainHeight } from './constants';

export const mainImageStyles = css`
  section {
    position: relative;
    height: ${mainHeight};
    width: var(--product-images-main-width, 100%);
  }

  section oryx-product-media {
    box-sizing: border-box;
    min-height: 1px;
  }

  slot:not(${isMainToggle}) section {
    display: flex;
    flex-grow: 1;
    scrollbar-width: none;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  slot:not(${isMainToggle}) section oryx-product-media {
    flex: 1 0 100%;
    scroll-snap-align: start;
  }

  slot${isMainToggle} section oryx-product-media {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity var(--oryx-transition-time) ease;
  }

  slot${isMainToggle} section oryx-product-media[active] {
    opacity: 1;
  }
`;
