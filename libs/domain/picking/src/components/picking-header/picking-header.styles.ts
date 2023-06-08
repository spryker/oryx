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
    color: var(--oryx-color-neutral-11);
  }

  button:not(.back),
  oryx-site-navigation-item {
    --oryx-icon-color: var(--oryx-color-primary-9);
  }

  oryx-customer-note-modal {
    margin-inline-start: -12px;
  }

  .title {
    flex: 1;
  }

  .back {
    --oryx-icon-size: 18px;
  }
`;
