import { css } from 'lit';

export const productAttributeStyles = css`
  dl {
    column-count: var(--column-count);
    margin: 0;
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
