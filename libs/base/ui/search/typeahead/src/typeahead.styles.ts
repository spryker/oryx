import { POPOVER_HEIGHT } from '@spryker-oryx/ui/popover';
import {
  baseStyles as searchboxBaseStyles,
  screenStyles as searchboxScreenStyles,
} from '@spryker-oryx/ui/searchbox';
import { screenCss } from '@spryker-oryx/utilities';
import { css, unsafeCSS as unsafecss } from 'lit';

export const baseStyles = [
  ...searchboxBaseStyles,
  css`
    :host {
      --oryx-popover-vertical-offset: 20px;

      position: relative;
      display: flex;
    }

    :host([__closed]) {
      --oryx-popover-visible: 0;
    }

    oryx-popover {
      margin: calc((var(--oryx-popover-vertical-offset) / 2) - 2px) 0;
      overflow: auto;
      max-height: min(
        calc(
          var(
            --_available-popover-height,
            var(--oryx-popover-maxheight, ${unsafecss(POPOVER_HEIGHT)}px)
          )
        )
      );
      width: var(--oryx-popover-width, 100%);
    }

    :host(:not([up]):not([popoverDirection])) oryx-popover,
    :host([popoverDirection='DOWN']) oryx-popover {
      inset-block-start: calc(
        var(--oryx-popover-distance, 42px) + var(--oryx-label-height, 0px)
      );
      transform-origin: left top;
    }

    :host([up]:not([popoverDirection])) oryx-popover,
    :host([popoverDirection='UP']) oryx-popover {
      inset-block-end: var(--oryx-popover-distance, 42px);
      transform-origin: left bottom;
    }

    :host([label]) oryx-popover,
    :host([has-label]) oryx-popover {
      --oryx-label-height: 23px;
    }

    :host([floatLabel]) oryx-popover {
      --oryx-label-height: 4px;
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
      color: var(--oryx-color-primary-9);
      animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(-1turn);
      }
    }
  `,
];

export const screenStyles = [
  ...searchboxScreenStyles,
  ...screenCss({
    sm: css`
      :host(:not([floatDisabled])) oryx-popover {
        --oryx-label-height: 4px;
      }
    `,
  }),
];
