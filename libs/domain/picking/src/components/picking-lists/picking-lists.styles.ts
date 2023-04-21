import { css } from 'lit';

export const styles = css`
  :host {
    padding: 24px 16px 0;
    display: grid;
    gap: 34px;
  }

  .no-items-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin: 45px;
    gap: 16px;
  }

  oryx-image {
    margin-inline: 40px;
    display: block;
  }
`;
