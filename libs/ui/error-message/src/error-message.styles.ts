import { css } from 'lit';

export const errorStyles = css`
  :host {
    --oryx-icon-size: 15px;

    display: flex;
    gap: 5px;
    align-items: center;
    color: var(--oryx-color-error);
    font-size: 12px;
  }

  oryx-icon {
    color: var(--oryx-color-error);
  }
`;
