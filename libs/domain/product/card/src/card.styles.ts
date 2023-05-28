import { css } from 'lit';

export const ProductCardStyles = css`
  :host {
    --oryx-link-color: currentColor;
    --oryx-link-color-hover: currentColor;

    align-self: stretch;
    flex: inherit;
    scroll-snap-align: inherit;
    display: grid;
    grid-template-columns: auto auto;
    transition: all var(--oryx-transition-time);
    background-color: var(--oryx-color-neutral-1);
    border: var(--oryx-border-thin) solid var(--oryx-color-neutral-3);
    box-shadow: var(--oryx-elevation-0) var(--oryx-color-elevation-2);
  }

  :host(:is(:hover, :focus-within)) {
    --effect: 10;

    box-shadow: var(--oryx-elevation-1) var(--oryx-color-elevation-2);
    border-color: var(--oryx-color-neutral-6);
  }

  a {
    display: contents;
    color: currentcolor;
  }

  a > * {
    grid-column: 1 / span 2;
  }

  oryx-product-media {
    height: 250px;
    display: block;
    grid-row-start: 1;
    grid-column-start: 1;
    background-color: var(--oryx-color-neutral-3);
  }

  oryx-product-labels,
  .actions {
    grid-row: 1;
    padding-block-start: 12px;
    z-index: 1;
  }

  .actions {
    justify-self: end;
  }

  a > *:not(:is(oryx-product-media, div.popover)) {
    padding-inline: 16px;
  }

  a > *:last-child {
    padding-block-end: 16px;
  }

  .popover[has-line-clamp] {
    --max-lines: var(--effect, var(--oryx-product-title-max-lines));

    display: flex;
    align-items: end;
    grid-row: 1;
    height: calc(250px + 16px + (var(--oryx-product-title-max-lines) * 30px));
  }

  oryx-product-title {
    display: block;
    padding: 16px 16px 5px;
    background-color: var(--oryx-color-neutral-1);
  }

  oryx-product-price::part(sales) {
    font-size: 18px;
    line-height: 18px;
    font-weight: 700;
  }

  oryx-product-price::part(original) {
    font-size: var(--oryx-typography-small-size);
    font-weight: var(--oryx-typography-small-weight);
    line-height: var(--oryx-typography-small-line);
  }

  oryx-product-price,
  oryx-cart-add {
    padding-block-start: 8px;
  }

  oryx-cart-add {
    align-self: end;
  }
`;
