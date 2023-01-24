import { css } from 'lit';

export const styles = css`
  form {
    display: grid;
    gap: var(--gap, 10px);
    grid-template-columns: 1fr 1fr;
  }

  form :not(.w50) {
    grid-column: 1 / span 2;
  }
`;
