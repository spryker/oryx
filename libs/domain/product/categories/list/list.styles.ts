import { css } from 'lit';

export const categoryListStyles = css`
  :host {
    display: contents;
    /* display: block;
    padding: 10px; */
  }

  div {
    position: relative;
    display: contents;
  }

  oryx-product-category-list {
    position: absolute;
    left: 100%;
    top: 0;
  }

  div:not(:hover) oryx-product-category-list {
    opacity: 0;
    pointer-events: none;
  }
`;
