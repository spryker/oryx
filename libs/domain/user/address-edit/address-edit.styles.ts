import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    width: 100%;
  }

  oryx-user-address-form {
    flex-basis: 100%;
  }

  oryx-button:last-of-type {
    margin-inline-start: var(--oryx-space-2);
  }
`;
