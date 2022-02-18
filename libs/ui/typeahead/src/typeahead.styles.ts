import { css } from 'lit';

export const typeaheadStyles = css`
  :host {
    position: relative;
    display: flex;
  }

  :host([__closed]) {
    --oryx-popover-visible: 0;
  }

  oryx-popover {
    margin: var(--oryx-popover-margin, 9px) 0;
    overflow: scroll;
    max-height: var(--oryx-popover-maxheight, 320px);
    width: 100%;
  }

  :host(:not([up]):not([popoverDirection])) oryx-popover,
  :host([popoverDirection='DOWN']) oryx-popover {
    top: calc(
      var(--oryx-popover-distance, 42px) + var(--oryx-label-height, 0px)
    );
    transform-origin: left top;
  }

  :host([up]:not([popoverDirection])) oryx-popover,
  :host([popoverDirection='UP']) oryx-popover {
    bottom: var(--oryx-popover-distance, 42px);
    transform-origin: left bottom;
  }

  label ~ oryx-popover {
    --oryx-label-height: 23px;
  }

  :host([has-value]) slot[name='option'] .placeholder {
    height: 120px;
  }

  :host(:not([has-value])) slot[name='loading'],
  :host(:not([has-value])) slot[name='empty'] {
    display: none;
  }

  slot[name='option'] .placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  slot[name='loading'] div {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  slot[name='loading'] div oryx-icon {
    color: var(--oryx-color-brand);
    animation: rotate 3s linear infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(-1turn);
    }
  }
`;
