import { css } from 'lit';

export const categoryListStyles = css`
  :host {
    /* --oryx-popover-visible: 1; */

    display: contents;
    width: inherit;
  }

  section {
    display: contents;
  }

  div {
    /* position: relative; */
    display: contents;
    width: inherit;
  }

  div > oryx-product-category-list {
    display: block;
  }

  oryx-product-category-list {
    position: absolute;
    inset-inline-start: 100%;
    inset-block-start: 0;
    /* outline: solid 1px red; */
    height: 100%;
    background-color: var(--oryx-color-neutral-1);
    width: inherit;
  }

  div:not(:hover) oryx-product-category-list {
    opacity: 0;
    pointer-events: none;
  }
`;
