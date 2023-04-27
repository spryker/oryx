import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    align-items: center;
    padding: 22px;
    gap: 12px;
    box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color-2);
  }

  oryx-heading {
    text-transform: uppercase;
    flex-grow: 1;
  }

  oryx-search {
    --floating-paddings: 32px;
  }
`;
