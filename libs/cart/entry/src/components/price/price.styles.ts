import { css } from 'lit';

export const cartEntryPriceStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  slot {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 16px;
    margin-inline-end: 2px;
    color: var(--oryx-color-neutral-darker);
  }
`;
