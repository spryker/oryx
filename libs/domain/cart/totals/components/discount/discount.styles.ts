import { ThemeStylesheets } from '@spryker-oryx/core';
import { css } from 'lit';

const cartTotalsDiscountRules = css`
  oryx-collapsible {
    box-sizing: border-box;
    width: 100%;
  }

  span:has(+ ul),
  ul span {
    padding-block: 0;
  }

  span > ul {
    padding-block: var(--oryx-space-2);
  }

  ul {
    grid-column: 1 / span 2;
    list-style: none;
    padding: 0;
    margin: var(--oryx-space) 0;
    color: var(--oryx-color-neutral-300);
  }

  li {
    display: grid;
    grid-template-columns: 1fr max-content;
  }

  li:not(:last-child) {
    margin-block-end: 10px;
  }

  span:nth-child(2) {
    margin-inline-start: auto;
    color: var(--oryx-color-highlight-400);
  }

  ul span {
    font-size: initial;
    font-weight: initial;
    line-height: initial;
  }
`;

export const cartTotalsDiscountStyles: ThemeStylesheets = [
  cartTotalsDiscountRules,
];
