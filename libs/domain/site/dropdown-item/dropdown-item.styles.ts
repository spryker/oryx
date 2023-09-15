import { css } from 'lit';

export const styles = css`
  oryx-button {
    --oryx-button-height: auto;
    --oryx-button-border: none;
    --oryx-button-padding: 0;
    --oryx-button-color: var(--oryx-color-neutral-12);
    --oryx-icon-color: var(--oryx-color-neutral-9);

    display: flex;
  }

  oryx-button:hover {
    background-color: var(--oryx-color-neutral-3);
  }

  span {
    display: flex;
    flex: 1;
    align-items: center;
  }

  a,
  span {
    padding: 9px 13px;
    justify-content: start;
    gap: 12px;
  }
`;
