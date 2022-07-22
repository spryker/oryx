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
    margin: 0 0 4px;
  }

  /* TODO: align with sf theme */

  /* .product p {
    margin: 0;
    font-weight: var(--oryx-font-extra-bold);
    font-size: 16px;
    color: #eb553c;
    display: flex;
    align-items: center;
  }

  .product p > :last-child {
    color: var(--oryx-color-neutral-darkest);
  }

  .product p > span + span {
    font-size: 12px;
    line-height: 18px;
    font-weight: var(--oryx-font-medium);
    margin-inline-start: 5px;
  } */
`;
