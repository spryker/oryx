import { css } from 'lit';

export const styles = css`
  :host {
    --oryx-tile-padding: 0;

    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .no-methods {
    text-align: center;
    line-height: 22px;
  }

  oryx-radio::part(label) {
    padding: 20px;
  }
`;
