import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { smScreen } from '@spryker-oryx/themes/breakpoints';
import {
  baseStyles as inputBaseStyles,
  screenStyles as inputScreenStyles,
} from '@spryker-oryx/ui/input';
import { css } from 'lit';

export const baseStyles = [
  ...inputBaseStyles,
  css`
    [class$='-button'] {
      cursor: pointer;
    }

    .clear-button[type='remove'] {
      --oryx-icon-size: var(--oryx-icon-size-medium);
    }

    .clear-button {
      opacity: 0;
      z-index: 1;
      transition: opacity var(--oryx-transition-time, 0.3s);
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

    :host([has-value]) .clear-button[appearance='toggle'] + [class$='-button'],
    :host([has-value])
      .clear-button[appearance='hover']:hover
      + [class$='-button'] {
      opacity: 0;
    }

    .back-button {
      display: none;
    }

    slot[name='trigger'] {
      display: none;
    }
  `,
];

const smallScreen = css`
  .clear-button[type='remove'] {
    --oryx-icon-size: var(--oryx-icon-size-large);
  }

  :host([open]) label {
    display: block;
  }

  :host(:not([not-floated])) label {
    position: absolute;
    display: none;
    inset-inline-start: calc(var(--floating-paddings, 20px) / 2);
    width: calc(100vw - var(--floating-paddings, 20px));
    transform: translateY(calc(-50% + var(--floating-offset, 16px)));
  }

  :host(:not([not-floated]))
    :is(slot[name='label'], .back-button + .search-button) {
    display: none;
  }

  :host(:not([not-floated])) :is(.back-button, slot[name='trigger']) {
    display: block;
  }
`;

export const screenStyles: ThemeStylesWithMedia[] = [
  ...inputScreenStyles,
  {
    media: smScreen,
    css: smallScreen,
  },
];
