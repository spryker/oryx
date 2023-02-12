import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  oryx-address-form {
    flex-basis: 100%;
  }

  oryx-button:last-child {
    margin-inline-start: var(--oryx-space-2);
  }
`;
