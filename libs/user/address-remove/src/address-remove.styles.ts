import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  section {
    display: flex;
    gap: 4px;
    color: var(--oryx-color-neutral-300);
    margin-block: var(--oryx-space-2) var(--oryx-space-6);
    font-size: 12px;
    line-height: 1.333em;
  }

  section,
  oryx-user-address {
    flex-basis: 100%;
  }

  oryx-button:last-child {
    margin-inline-start: var(--oryx-space-2);
  }

  oryx-icon {
    --oryx-icon-size: 16px;
    --_margin: 0;
    --oryx-icon-color: var(--oryx-color-neutral-300);
  }
`;
