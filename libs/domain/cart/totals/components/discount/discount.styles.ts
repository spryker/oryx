import { ThemeStylesheets } from '@spryker-oryx/experience';
import { css } from 'lit';

const cartTotalsDiscountRules = css`
  oryx-collapsible {
    box-sizing: border-box;
    width: 100%;
  }

  span:has(+ ul),
  ul :is(span, oryx-site-price) {
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
    color: var(--oryx-color-neutral-9);
  }

  li {
    display: grid;
    grid-template-columns: 1fr max-content;
  }

  li:not(:last-child) {
    margin-block-end: 10px;
  }

  oryx-site-price {
    margin-inline-start: auto;
    color: var(--oryx-color-highlight-10);
  }

  ul :is(span, oryx-site-price) {
    font-size: initial;
    font-weight: initial;
    line-height: initial;
  }
`;

export const cartTotalsDiscountStyles: ThemeStylesheets = [
  cartTotalsDiscountRules,
];
