import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    background-color: var(--oryx-color-primary-9);
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: var(--oryx-color-neutral-1);
    --oryx-icon-size: 32px;
  }

  :host:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--oryx-color-primary-9);
    z-index: -1;
  }

  oryx-heading {
    margin-top: 43px;
  }

  oryx-image {
    height: 82px;
    display: flex;
  }

  h3 {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }

  oryx-spinner {
    flex-basis: 0;
    margin-top: 134px;
    color: var(--oryx-color-neutral-1);
  }
`;
