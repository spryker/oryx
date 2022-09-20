import { css } from 'lit';

export const tabPanelStyles = css`
  :host {
    display: none;
  }

  :host([selected]) {
    display: block;
  }
`;
