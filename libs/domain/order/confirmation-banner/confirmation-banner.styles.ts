import { css } from 'lit';

export const orderConfirmationBannerStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--oryx-color-primary-3);
    padding-block-end: 48px;
  }

  section {
    display: flex;
    align-items: center;
    color: var(--oryx-color-primary-9);
    gap: 40px;
    margin: 40px 0 16px;
  }

  p {
    margin: 0;
  }
`;
