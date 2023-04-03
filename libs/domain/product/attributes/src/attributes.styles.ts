import { css } from 'lit';

export const ProductAttributeStyles = css`
  dl {
    column-count: var(--column-count);
  }

  dl > * {
    break-inside: avoid-column;
  }

  dd {
    break-before: avoid-column;
    margin-inline: 0;
    margin-block: 10px 20px;
    color: var(--oryx-color-neutral-300);
  }
`;
