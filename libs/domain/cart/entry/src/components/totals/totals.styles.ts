import { css } from 'lit';

export const cartEntryTotalsStyles = css`
  :host {
    display: flex;
    justify-content: flex-end;
    padding: 7px var(--oryx-space-4);
    background: var(--oryx-color-canvas-200);
  }

  cart-entry-price::part(price) {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
  }
`;
