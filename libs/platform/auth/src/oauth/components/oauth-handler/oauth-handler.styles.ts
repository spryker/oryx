import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    background-color: var(--oryx-color-primary-300);
    justify-content: center;
    height: 100vh;
    color: var(--oryx-color-canvas-100);
  }

  :host:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--oryx-color-primary-300);
    z-index: -1;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .text {
    margin-top: 43px;
  }

  .logo {
    height: 82px;
  }

  h3 {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }

  .spinner {
    margin-top: 134px;
  }
`;
