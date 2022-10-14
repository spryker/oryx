import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-layout-gap: 10px;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    gap: var(--oryx-layout-gap);
  }
`;
