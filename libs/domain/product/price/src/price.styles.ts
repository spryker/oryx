import { css } from 'lit';

export const ProductPriceStyles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 10px;
    font-size: 1.286em;
    font-weight: 700;
    line-height: 1.444em;
    color: var(--oryx-color-neutral-400);
  }

  [part='sales'] {
    color: var(--oryx-color-highlight-300);
  }

  [part='original'] {
    font-size: 0.666em;
    font-weight: 500;
    text-decoration: line-through;
    color: var(--oryx-color-neutral-400);
    flex: 50%;
  }

  [part='vat'] {
    font-size: 0.666em;
    font-weight: 500;
    flex: 50%;
  }
`;
