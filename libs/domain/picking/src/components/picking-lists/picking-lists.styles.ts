import { css } from 'lit';

export const styles = css`
  :host {
    padding: 24px 16px 0;
    width: 100%;
    display: grid;
    gap: 34px;
  }

  oryx-modal [slot='heading'] {
    font-size: 18px;
    font-weight: 600;
  }

  oryx-modal oryx-button {
    width: 100%;
  }
`;
