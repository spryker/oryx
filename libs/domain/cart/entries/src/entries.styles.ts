import { css } from 'lit';

export const cartEntriesStyles = css`
  h1 {
    font-size: var(--oryx-typography-h3-size);
    font-weight: var(--oryx-typography-h3-weight);
    line-height: var(--oryx-typography-h3-line);
    margin-block-end: 20px;
  }

  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-canvas-500);
  }

  section.empty {
    --oryx-icon-size: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--oryx-space-4);
    background: var(--oryx-color-canvas-200);
  }

  section p {
    margin-block: 14px 25px;
  }

  [slot='header'] {
    display: flex;
    align-items: center;
  }

  oryx-chip {
    margin-inline-start: var(--oryx-space-2);
  }

  oryx-heading {
    text-align: var(--oryx-typography-h1-align);
  }
`;
