import { css } from 'lit';

export const ProductPriceStyles = css`
  :host {
    display: flex;
    gap: 10px;
    color: var(--oryx-color-highlight-300);
    font-size: 1.286em;
    font-weight: 700;
    line-height: 1.444em;
  }

  [part='original'] {
    font-size: 0.666em;
    font-weight: 500;
    text-decoration: line-through;
    color: var(--oryx-color-neutral-400);
  }
`;
