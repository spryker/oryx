import { ThemeStylesheets } from '@spryker-oryx/core';
import { css } from 'lit';

const cartTotalsDiscountRules = css`
  oryx-collapsible {
    padding-block: var(--oryx-space-2);
    box-sizing: border-box;
    width: 100%;
  }

  span {
    padding-block: 0;
  }

  ul {
    grid-column: 1 / span 2;
    list-style: none;
    padding: 0;
    margin: var(--oryx-space-2) 0 0 0;
    color: var(--oryx-color-neutral-300);
  }

  li {
    display: flex;
    justify-content: space-between;
  }

  span:nth-child(2) {
    margin-inline-start: auto;
    color: var(--oryx-color-highlight-400);
  }
`;

export const cartTotalsDiscountStyles: ThemeStylesheets = [
  cartTotalsDiscountRules,
];
