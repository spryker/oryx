import { css, unsafeCSS as unsafecss } from 'lit';
import { POPOVER_MAX_HEIGHT_FALLBACK } from '../../popover';

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
    overflow: auto;
    max-height: min(
      var(
        --_available-popover-height,
        ${unsafecss(POPOVER_MAX_HEIGHT_FALLBACK)}px
      ),
      var(--oryx-popover-maxheight, ${unsafecss(POPOVER_MAX_HEIGHT_FALLBACK)}px)
    );
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

  :host([has-label]) oryx-popover {
    --oryx-label-height: 23px;
  }

  slot .placeholder {
    height: 120px;
  }

  .placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  slot[name='loading'] oryx-icon {
    color: var(--oryx-color-brand);
    animation: rotate 3s linear infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(-1turn);
    }
  }
`;
