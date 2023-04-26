import { ThemeToken } from '@spryker-oryx/core';

export const tokens: ThemeToken = {
  layout: {
    container: {
      width: '1340px',
      padding: '50px',
    },
    cols: '12',
    factor: '3',
  },
  box: {
    shadow: {
      focus: '0 0 3px var(--oryx-color-focus)',
    },
  },
  elevation: {
    color: 'rgb(23 11 11 / 15%)',
    'color-2': 'rgb(18 18 18 / 15%)',
    0: '0 1px 3px',
    1: '0 4px 12px',
    2: '1px 3px 18px',
    3: '-2px 2px 20px',
  },
  'transition-time': '0.3s',
  transition: {
    time: {
      medium: '0.6s',
      long: '0.9s',
    },
  },
  'border-radius': '10px',
  border: {
    thin: '1px',
    thick: '2px',
    radius: {
      small: '4px',
      medium: '5px',
      large: '24px',
    },
  },
  space: '5px',
  'space-2': 'calc(var(--oryx-space) * 2)',
  'space-3': 'calc(var(--oryx-space) * 3)',
  'space-4': 'calc(var(--oryx-space) * 4)',
  'space-6': 'calc(var(--oryx-space) * 6)',
  icon: {
    size: {
      default: 'var(--oryx-icon-size-large, 24px)',
      large: '24px',
      medium: '20px',
      small: '16px',
    },
  },
  required: {
    asterisk: {
      color: 'var(--oryx-color-primary-300)',
    },
  },
};
