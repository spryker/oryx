import { css } from 'lit';

export const styles = css`
  [slot='heading'] {
    justify-content: space-between;
    align-items: baseline;
    display: flex;
    width: 100%;
  }

  [slot='heading'] span {
    font-weight: var(--oryx-typography-h2-weight);
    font-size: var(--oryx-typography-h2-size);
    line-height: var(--oryx-typography-h2-line);
  }

  [slot='heading'] h4 {
    color: var(--oryx-color-neutral-darker);
    margin-inline-start: auto;
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
