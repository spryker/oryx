import { css } from 'lit';

export const checkboxListStyles = css`
  :host slot {
    display: flex;
    gap: 8px;
  }

  :host([direction='vertical']) slot {
    flex-direction: column;
  }

  slot[name='heading'] {
    margin-bottom: 8px;
  }
`;
