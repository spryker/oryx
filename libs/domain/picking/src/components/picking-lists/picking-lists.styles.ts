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
  }

  .img-wrap {
    padding: 16px 40px;
  }
`;
