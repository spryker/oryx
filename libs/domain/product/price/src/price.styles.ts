import { css } from 'lit';

export const ProductPriceStyles = css`
  :host {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    justify-content: start;
    align-items: baseline;
    gap: 6px;
  }

  [part='sales'] {
    grid-column: 1 / span 2;
    font-size: var(--oryx-typography-h2-size);
    font-weight: var(--oryx-typography-h2-weight);
    line-height: var(--oryx-typography-h2-line);
  }

  [has-discount] {
    color: var(--oryx-color-highlight-300);
  }

  [part='original'] {
    font-size: var(--oryx-typography-h4-size);
    font-weight: var(--oryx-typography-h4-weight);
    line-height: var(--oryx-typography-h4-line);
    text-decoration: line-through;
  }

  [part='tax'] {
    font-size: var(--oryx-typography-caption-size);
    font-weight: var(--oryx-typography-caption-weight);
    line-height: var(--oryx-typography-caption-line);
    color: var(--oryx-color-neutral-300);
  }

  [part='labels'] {
    grid-column: 2 / span 2;
    padding: 0;
  }
`;

export const oldProductPriceStyles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 10px;
    // font-size: 1.286em;
    // font-weight: 700;
    // line-height: 1.444em;
    color: var(--oryx-color-neutral-400);
  }

  [part='sales'] {
    color: var(--oryx-color-highlight-300);
  }

  [part='original'] {
    font-size: var(--oryx-typography-h4-size);
    font-weight: var(--oryx-typography-h4-weight);
    line-height: var(--oryx-typography-h4-line);
    text-decoration: line-through;
    color: var(--oryx-color-neutral-400);
    flex: 50%;
  }

  [part='vat'] {
    // font-size: 0.666em;
    // font-weight: 500;
    flex: 50%;
  }
`;
