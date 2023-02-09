import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-tile-padding: 0;

    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-methods {
    --oryx-icon-size: 40px;

    text-align: center;
    line-height: 22px;
  }

  div {
    display: flex;
  }

  oryx-radio {
    padding: var(--oryx-space-4);
  }

  .price {
    font-weight: 600;
    font-size: var(--oryx-font-size-medium);
    margin-inline-start: auto;
  }

  small {
    font-weight: 600;
    color: var(--oryx-color-neutral-200);
  }

  p {
    margin: 0;
  }
`;
