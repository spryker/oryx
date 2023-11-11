import { css } from 'lit';

export const categoryListStyles = css`
  :host {
    display: contents;
  }

  div {
    position: relative;
    display: contents;
  }

  oryx-product-category-list {
    position: absolute;
    inset-inline-start: 100%;
    inset-block-start: 0;
  }

  div:not(:hover) oryx-product-category-list {
    opacity: 0;
    pointer-events: none;
  }
`;
