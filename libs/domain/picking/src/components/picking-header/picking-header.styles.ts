import { css } from 'lit';

export const styles = css`
  :host {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    background-color: var(--oryx-color-neutral-1);
    display: flex;
    align-items: center;
    height: 66px;
    gap: 12px;
    padding: 0 24px;

    --oryx-button-color: var(--oryx-color-primary-9);

    color: var(--oryx-color-neutral-11);
  }

  .title {
    display: flex;
    flex: 1;
    gap: 12px;
  }

  .back {
    color: var(--oryx-color-neutral-11);
    background-color: transparent;
    border: none;
    cursor: pointer;

    --oryx-icon-size: 18px;
  }
`;
