import { css } from 'lit';

export const styles = css`
  [slot='heading'] {
    justify-content: space-between;
    align-items: center;
    display: flex;
    width: 100%;
  }

  [slot='heading'] span {
    font-weight: var(--oryx-typography-h3-weight);
    font-size: var(--oryx-typography-h3-size);
    line-height: var(--oryx-typography-h3-line);
  }

  [slot='heading'] h6 {
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
    align-items: center;
    gap: 8px;
    height: 24px;
    width: 100%;
  }

  .total oryx-icon {
    display: inline;
  }

  oryx-icon-button {
    margin-inline-start: auto;
  }

  oryx-button {
    margin-block: 0;
    width: 100%;
  }
`;
