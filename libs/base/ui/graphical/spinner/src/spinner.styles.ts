import { css } from 'lit';

export const styles = css`
  :host {
    /* stylelint-disable-next-line */
    --_margin: 0px;

    display: flex;
    aspect-ratio: 1 / 1;
    justify-content: center;
    color: var(--oryx-color-primary-9, inherit);
  }

  oryx-icon,
  ::slotted(oryx-icon) {
    animation-duration: 1200ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  :host([rotation='clockwise']) oryx-icon,
  :host([rotation='clockwise']) ::slotted(oryx-icon) {
    animation-name: clockwise;
  }

  :host([rotation='anticlockwise']) oryx-icon,
  :host([rotation='anticlockwise']) ::slotted(oryx-icon) {
    animation-name: anticlockwise;
  }

  @keyframes clockwise {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes anticlockwise {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
`;
