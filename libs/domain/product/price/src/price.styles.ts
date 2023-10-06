import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const productPriceStyles = css`
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
    ${headingUtil(HeadingTag.H2)}

    grid-column: 1 / span 2;
  }

  [part='original'] {
    ${headingUtil(HeadingTag.H4)}
  }

  [part='tax'] {
    ${headingUtil(HeadingTag.Caption)}

    color: var(--oryx-color-neutral-9);
  }

  [part='labels'] {
    grid-column: 2 / span 2;
    padding: 0;
  }
`;
/**
 * @deprecated since 1.2.0. Use `productPriceStyles` (camelCase) instead.
 */
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
    color: var(--oryx-color-highlight-9);
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
    color: var(--oryx-color-neutral-9);
  }

  [part='labels'] {
    grid-column: 2 / span 2;
    padding: 0;
  }
`;

/**
 * @deprecated since 1.2.0. Cleanup, it was not used anywhere.
 */
export const oldProductPriceStyles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 10px;
    color: var(--oryx-color-neutral-11);
  }

  [part='sales'] {
    color: var(--oryx-color-highlight-9);
  }

  [part='original'] {
    font-size: var(--oryx-typography-h4-size);
    font-weight: var(--oryx-typography-h4-weight);
    line-height: var(--oryx-typography-h4-line);
    text-decoration: line-through;
    color: var(--oryx-color-neutral-11);
  }
`;
