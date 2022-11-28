import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-methods {
    text-align: center;
    line-height: 22px;

    --oryx-icon-size: 40px;
  }

  h3 {
    line-height: 24px;
    margin: 0;
    font-size: var(--oryx-font-size-medium);
  }

  oryx-radio {
    flex: 1;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
  }

  .price {
    font-weight: 600;
    font-size: var(--oryx-font-size-medium);
  }

  .delivery {
    flex-basis: 100%;
    font-weight: 600;
    color: var(--oryx-color-neutral-200);
    margin-inline-start: calc(var(--oryx-radio-size, 18px) + 8px);
  }
`;
