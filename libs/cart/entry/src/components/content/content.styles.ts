import { css } from 'lit';

export const cartEntryContentStyles = css`
  product-title {
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  product-title,
  product-id {
    margin: 0 0 2px;
    padding-inline-end: calc(var(--oryx-space-2) * 3);
  }

  .seller {
    margin-bottom: var(--oryx-space-4);
  }

  .seller,
  .row {
    display: flex;
  }

  .seller,
  product-id {
    color: var(--oryx-color-neutral-darker);
  }

  .seller :last-child {
    color: var(--oryx-color-brand);
    margin-inline-start: var(--oryx-space-2);
  }

  cart-entry-price oryx-icon {
    --oryx-icon-size: 11px;

    color: var(--oryx-color-neutral-darker);
    margin-inline-end: 3.5px;
  }

  section {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--oryx-space-2);
  }

  .col {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex: 1 1;
  }

  .col:first-child {
    margin-bottom: var(--oryx-space-2);
  }

  @media (min-width: 1025px) {
    section {
      flex-direction: row;
    }

    .col:first-child {
      margin-bottom: 0;
      margin-inline-end: 13px;
    }

    .col:last-child {
      margin-inline-start: 13px;
    }
  }

  @media (min-width: 769px) {
    h3 {
      font-size: 14px;
      line-height: inherit;
      padding-inline-end: calc(var(--oryx-space-2) * 3);
    }

    .seller {
      margin-bottom: var(--oryx-space-2);
    }
  }
`;
