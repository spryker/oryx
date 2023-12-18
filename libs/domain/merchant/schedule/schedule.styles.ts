import { css } from 'lit';

export const merchantScheduleStyles = css`
  :host {
    display: grid;
    gap: 8px;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  li div {
    grid-column: 2;
  }
`;
