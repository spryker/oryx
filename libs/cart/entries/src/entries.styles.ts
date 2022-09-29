import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--oryx-space-4);
  }

  section {
    --oryx-icon-size: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--oryx-space-4);
    background: var(--oryx-color-neutral-lighter);
  }

  section p {
    margin-block: 14px 25px;
  }
`;
