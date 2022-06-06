import { css } from 'lit';
// ToDo: update styles after finalised theme styleguide
export const styles = css`
  :host {
    display: block;
    font: normal 400 1.572rem/1.136 Arial, sans-serif;
    color: #eb553c;
  }

  .price {
    display: flex;
    align-items: baseline;
  }

  .default {
    padding-inline-end: 0.65rem;
  }

  .original {
    /* stylelint-disable-next-line */
    text-decoration-line: line-through;
    font-size: 1.357rem;
    line-height: 1;
    color: #b2b2b2;
  }
`;
