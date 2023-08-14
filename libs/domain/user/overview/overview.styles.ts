import { css } from 'lit';

export const styles = css`
  :host {
    gap: 20px;
    display: flex;
    flex-direction: column;
  }

  .content {
    background-color: var(--oryx-color-neutral-5);
    flex: 1;
  }
`;
