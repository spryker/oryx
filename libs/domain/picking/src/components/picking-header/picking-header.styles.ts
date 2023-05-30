import { css } from 'lit';

export const styles = css`
  :host {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    background-color: var(--oryx-color-canvas-100);
    display: flex;
    align-items: center;
    height: 66px;
    gap: 22px;
    padding: 0 24px;

    --oryx-button-color: var(--oryx-color-primary-300);

    color: var(--oryx-color-neutral-400);
  }

  .title {
    display: flex;
    flex: 1;
    gap: 12px;
  }

  .back {
    color: var(--oryx-color-neutral-400);
    background-color: transparent;
    border: none;
    cursor: pointer;

    --oryx-icon-size: 18px;
  }
`;
