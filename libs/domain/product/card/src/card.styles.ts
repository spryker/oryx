import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

const gridStyles = css`
  :host([template='grid']) {
    background: var(--oryx-color-neutral-3);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation-2);
    border: var(--oryx-border-thin) solid var(--oryx-color-neutral-3);
    border-radius: var(--oryx-border-radius-small);
  }

  :host([template='grid']:is(:hover, :focus-within)) {
    border-color: var(--oryx-color-neutral-6);
    box-shadow: var(--oryx-elevation-2) var(--oryx-color-elevation-2);
  }

  :host([template='grid']) a {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr auto;
    justify-content: space-between;
    align-self: stretch;
    height: 100%;
    outline: none;
  }

  :host([template='grid']) a > * {
    grid-column: 1 / span 2;
  }

  :host([template='grid']) oryx-product-media {
    z-index: -1;
    height: 250px;
    grid-area: 1 / 1 / auto / span 2;
    border-start-start-radius: 4px;
    border-start-end-radius: 4px;
  }

  :host([template='grid']) :is(oryx-product-labels, .actions) {
    grid-row: 1;
    align-self: start;
    margin: 12px;
  }

  :host([template='grid']) oryx-product-labels {
    grid-column: 1;
  }

  :host([template='grid']) .actions {
    grid-column: 2;
  }

  :host([template='grid']) div.details {
    background-color: var(--oryx-color-neutral-1);
    padding-block: 12px 16px;
    padding-inline: 16px;
    border-end-start-radius: 4px;
    border-end-end-radius: 4px;
  }

  :host([template='grid']) oryx-product-price {
    margin-block: 8px 2px;
  }

  :host([template='grid']) oryx-product-price::part(sales) {
    font-size: 18px;
    line-height: 18px;
    font-weight: 700;
  }

  :host([template='grid']) oryx-product-price::part(original) {
    ${headingUtil(HeadingTag.Small)}
  }

  :host([template='grid']) oryx-cart-add {
    display: block;
    align-self: end;
  }
`;

const listStyles = css`
  :host([template='list']) {
    --oryx-image-fallback-size: 42px;
    --oryx-image-fallback-background: var(--oryx-color-neutral-3);
  }

  :host([template='list']) a {
    height: 60px;
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: 2px 10px;
    padding-block: 10px;
    padding-inline: 10px 15px;
    align-content: center;
  }

  :host([template='list']) a:focus-visible {
    outline: solid 1px var(--oryx-color-focus);
  }

  :host([template='list']) oryx-product-media {
    grid-row: span 2;
    max-height: 60px;
  }

  :host([template='list']) oryx-product-title,
  oryx-product-price {
    grid-column: 2;
  }

  :host([template='list']) oryx-cart-add {
    grid-column: 3;
    grid-row: 1 / span 2;
  }

  :host([template='list']) oryx-product-title {
    align-self: end;
  }

  :host([template='list']) oryx-product-price {
    align-self: start;
    display: flex;
  }

  :host([template='list']) oryx-product-price::part(tax) {
    order: 3;
  }

  :host([template='list']) oryx-product-price::part(original) {
    font-size: var(--oryx-typography-size);
    font-weight: var(--oryx-typography-weight);
    line-height: var(--oryx-typography-line);
  }

  :host([template='list']) oryx-product-price::part(sales) {
    ${headingUtil(HeadingTag.H5)}
  }
`;

export const ProductCardStyles = css`
  :host {
    isolation: isolate;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ${gridStyles}
  ${listStyles}
`;
