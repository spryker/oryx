import { css } from 'lit';

export const cartTotalsCouponStyles = css`
  oryx-collapsible {
    border: none;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    grid-column: 1;
  }

  li {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  [valid] {
    color: var(--oryx-color-success-9);
  }

  [invalid] {
    color: var(--oryx-color-error-9);
  }
`;
