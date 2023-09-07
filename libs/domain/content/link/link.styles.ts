import { css } from 'lit';

export const styles = css`
  :host([appearance='navigation']) oryx-link {
    padding: 9px 13px;
    display: flex;
    height: 24px;
    align-items: center;
    cursor: pointer;
  }

  :host([appearance='navigation']:hover) oryx-link {
    background-color: var(--oryx-color-neutral-3);
  }
`;
