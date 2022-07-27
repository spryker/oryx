import { css } from 'lit';

export const searchboxStyles = css`
  [slot='option']::before,
  [slot='option']::after {
    height: 30px;
  }

  [slot='option']::before {
    /* stylelint-disable-next-line */
    background: linear-gradient(180deg, #fff 0, #fff0 100%);
  }

  [slot='option']::after {
    /* stylelint-disable-next-line */
    background: linear-gradient(0deg, #fff 0, #fff0 100%);
  }

  .product {
    transition: background var(--oryx-transition-time);
    background: transparent;
    color: var(--oryx-color-neutral-darkest);
  }

  .product:hover {
    background: var(--oryx-color-neutral-lighter);
  }

  .product product-title {
    margin-bottom: 4px;
  }
`;
