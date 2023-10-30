import {
  baseStyles as inputBaseStyles,
  screenStyles as inputScreenStyles,
} from '@spryker-oryx/ui/input';
import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const baseStyles = [
  ...inputBaseStyles,

  css`
    [class$='-button'] {
      cursor: pointer;
    }

    :host([float]:not([open])) label {
      display: none;
      position: relative;
    }

    :host([float]) label {
      position: absolute;
      inset-inline-start: var(--floating-padding-start, 10px);
      inset-inline-end: var(
        --floating-padding-end,
        var(--floating-padding-start, 10px)
      );
      width: calc(
        100% -
          calc(
            var(--floating-padding-start, 10px) +
              calc(
                var(--floating-padding-end, var(--floating-padding-start, 10px))
              )
          )
      );
      transform: translateY(calc(-50% + var(--floating-vertical-offset, 20px)));
      z-index: 1;
    }

    :host([float]) :is(slot[name='label'], .back-button + .search-button) {
      display: none;
    }

    .clear-button[type='remove'] {
      --oryx-icon-size: var(--oryx-icon-size-md);
    }

    oryx-icon {
      transition: opacity var(--oryx-transition-time, 0.3s);
    }

    .clear-button {
      opacity: 0;
      z-index: 1;
      align-self: center;
    }

    :host(:not([has-value])) [appearance='show'] {
      display: none;
    }

    :host([has-value]) .clear-button:not([appearance='hover']),
    :host([has-value]) .clear-button[appearance='hover']:hover {
      opacity: 1;
    }

    .clear-button:not([appearance='show']) + oryx-icon {
      position: absolute;
    }

    :host([has-value]) .clear-button[appearance='toggle'] + oryx-icon,
    :host([has-value]) .clear-button[appearance='hover']:hover + oryx-icon {
      opacity: 0;
    }

    :host(:not([float])) :is(slot[name='trigger'], .back-button) {
      display: none;
    }

    slot[name='trigger'] {
      display: inline-flex;
    }
  `,
];

const smallScreen = css`
  :host([float]) label {
    position: absolute;
  }

  .clear-button[type='remove'] {
    --oryx-icon-size: var(--oryx-icon-size-lg);
  }

  :host(oryx-search:not([floatDisabled]):not([label])),
  :host(oryx-search:not([floatDisabled]):not([label]))
    ::slotted(select:invalid) {
    --oryx-color-placeholder: var(--oryx-color-neutral-11);
  }
`;

export const screenStyles = [
  ...inputScreenStyles,
  ...screenCss({
    sm: smallScreen,
  }),
];
