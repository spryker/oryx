import { css } from 'lit';

export const styles = css`
  :host {
    /* stylelint-disable-next-line */
    --_margin: 0px;

    display: flex;
    height: var(--oryx-icon-size, var(--oryx-icon-size-large, 24px));
    aspect-ratio: 1 / 1;
    justify-content: center;
    color: var(--oryx-icon-color, inherit);
  }

  svg,
  ::slotted(svg) {
    fill: currentColor;
    width: calc(var(--oryx-icon-size, 24px) - (var(--_margin) * 2));
    aspect-ratio: 1 / 1;
    margin: var(--_margin);
    transition: var(--oryx-transition-time);
  }

  :host([size='medium']) {
    --_margin: 3px;
  }

  :host([size='small']) {
    --_margin: 6px;
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
`;
