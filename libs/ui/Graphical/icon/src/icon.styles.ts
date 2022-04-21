import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    height: var(--oryx-icon-size, var(--oryx-icon-size-large, 24px));
    aspect-ratio: 1 / 1;
    justify-content: center;
    color: var(--oryx-icon-color, inherit);
  }

  svg,
  ::slotted(svg) {
    fill: currentColor;
    max-width: var(--oryx-icon-size, 24px);
    aspect-ratio: 1 / 1;
    transition: var(--oryx-transition-time);
  }

  :host([size='medium']) svg,
  :host([size='medium']) ::slotted(svg) {
    margin: 3px;
  }

  :host([size='small']) svg,
  :host([size='small']) ::slotted(svg) {
    margin: 6px;
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

  :host([type='popular']) {
    color: #ff6800;
  }

  :host([type='goldPartner']) {
    color: #fdaf1c;
  }

  :host([type='silverPartner']) {
    color: #9ea1a6;
  }

  :host([type='front']) {
    transform: rotate(180deg);
  }
  :host([type='dropUp']) {
    transform: rotate(90deg);
  }
  :host([type='dropdown']) {
    transform: rotate(-90deg);
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
