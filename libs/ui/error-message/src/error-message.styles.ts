import { css } from 'lit';

export const errorStyles = css`
  :host {
    --oryx-icon-size: 15px;
    --oryx-icon-color: currentColor;

    display: flex;
    gap: 5px;
    align-items: center;
    color: var(--oryx-color-error-300);
    font-size: 12px;
  }
`;
