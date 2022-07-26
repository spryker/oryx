import { css } from 'lit';

export const ProductAttributeStyles = css`
  :host {
    --column-count: 2;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    column-count: var(--column-count);
  }

  li {
    break-inside: avoid;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    margin-bottom: 20px;
  }

  li > div {
    margin: 0;
    color: var(--oryx-color-neutral-dark);
    font-size: 14px;
  }

  li > div:first-child {
    font-weight: bold;
    font-size: 16px;
    color: var(--oryx-color-ink);
  }
`;
