import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  oryx-address-list-item {
    padding: 0;
  }

  :not([selected]) oryx-address-list-item {
    border: var(--oryx-border-thick) solid transparent;
  }

  slot[name='empty'] {
    --oryx-icon-size: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
    background: var(--oryx-color-canvas-200);
  }

  slot[name='empty'] oryx-icon {
    margin-block-end: 15px;
  }
`;
