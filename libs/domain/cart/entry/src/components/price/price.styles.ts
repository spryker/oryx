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
    color: var(--oryx-color-neutral-400);
  }

  span {
    position: relative;
  }

  span::before {
    content: '';
    position: absolute;
    display: none;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--oryx-border-radius-small);
    background: var(--oryx-color-canvas-500);
  }

  :host([loading]) span::before {
    display: block;
  }
`;
