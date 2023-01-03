import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  section {
    --oryx-icon-color: var(--oryx-color-neutral-300);

    display: flex;
    gap: 4px;
    color: var(--oryx-color-neutral-300);
    margin-block: var(--oryx-space-2) var(--oryx-space-6);
  }

  section,
  oryx-user-address {
    flex-basis: 100%;
  }

  oryx-button:last-child {
    margin-inline-start: var(--oryx-space-2);
  }
`;
