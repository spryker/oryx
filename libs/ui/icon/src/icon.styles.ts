import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    height: var(--oryx-icon-size, var(--oryx-icon-size-large, 24px));
    aspect-ratio: 1 / 1;
    justify-content: center;
  }

  svg,
  ::slotted(svg) {
    fill: currentColor;
    width: var(--oryx-icon-size, 24px);
    aspect-ratio: 1 / 1;
  }

  :host([size='large']) {
    --oryx-icon-size: var(--oryx-icon-size-large, 24px);
  }

  :host([size='medium']) {
    --oryx-icon-size: var(--oryx-icon-size-medium, 18px);

    padding: 3px;
  }

  :host([size='small']) {
    --oryx-icon-size: var(--oryx-icon-size-small, 12px);

    padding: 6px;
  }

  /* standard colors */
  :host([type='warning']) {
    color: var(--oryx-color-warning);
  }
  :host([type='error']) {
    color: var(--oryx-color-error);
  }
  :host([type='success']) {
    color: var(--oryx-color-success);
  }
  :host([type='info']),
  :host([type='filter']) {
    color: var(--oryx-color-info);
  }

  :host([type='loader']) {
    color: var(--oryx-color-brand);
    animation-name: spin;
    animation-duration: 3000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
`;
