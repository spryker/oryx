import { css } from 'lit';

export const styles = css`
  oryx-card {
    --oryx-card-header-padding: 14px 10px 10px;
    --oryx-card-body-padding: 9px 10px 16px;
    --oryx-card-footer-padding: 0 10px 12px;
  }

  [slot='heading'] {
    justify-content: space-between;
    align-items: baseline;
    font-weight: 600;
    display: flex;
    width: 100%;
  }

  [slot='heading'] div:only-child {
    margin-inline-start: auto;
  }

  .time {
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.0133em;
  }

  .identifier {
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--oryx-color-neutral-darker);
  }

  ::part(body) {
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.005em;
    display: flex;
    justify-content: space-between;
    min-height: 38px;
  }

  .total {
    color: var(--oryx-color-neutral-darker);
    display: flex;
    gap: 8px;
    height: fit-content;
  }

  .total oryx-icon {
    display: inline;
  }

  oryx-icon-button {
    align-items: start;
    height: fit-content;
  }

  oryx-icon[type='info'] {
    color: var(--oryx-color-primary-300);
  }

  oryx-button {
    margin-block: 0;
    width: 100%;
  }
`;
