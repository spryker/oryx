import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const smallScreen = css`
  :host {
    padding-block: 0;
  }

  :host([readonly]) {
    padding-block-end: 17px;
  }

  oryx-product-media,
  section.details {
    margin-block-start: 16px;
  }

  oryx-product-title {
    font-size: var(--oryx-typography-h4-size);
    font-weight: var(--oryx-typography-h4-weight);
    line-height: var(--oryx-typography-h4-line);
  }

  :host([readonly]) :is(section.details, section.pricing) {
    gap: 8px;
  }

  section.pricing {
    grid-column: 2;
    grid-row: 2;
    justify-items: start;
  }

  :host([readonly]) section.pricing {
    margin-block-start: 8px;
  }

  .entry-price {
    font-size: var(--oryx-typography-h3-size);
    font-weight: var(--oryx-typography-h3-weight);
    line-height: var(--oryx-typography-h3-line);
  }

  oryx-product-media {
    width: 74px;
    margin-inline-start: 16px;
  }

  oryx-cart-quantity-input {
    margin-block: 18px;
  }

  .actions {
    grid-column: 1 / span 3;
    grid-row: 3;
    background: var(--oryx-color-neutral-3);
    padding: 16px;
    margin-block-start: 20px;
  }

  :host(:first-of-type) {
    border-block-start: 1px solid var(--oryx-color-neutral-4);
  }
`;

export const cartEntryScreenStyles = screenCss({
  sm: smallScreen,
});
