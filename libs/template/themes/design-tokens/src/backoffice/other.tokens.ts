import { ThemeToken } from '@spryker-oryx/core';

export const tokens: ThemeToken = {
  line: {
    height: {
      base: '24px',
      caption: '26px',
    },
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
      medium: '10px',
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
      default: 'var(--oryx-icon-size-large)',
      large: '24px',
      medium: '18px',
      small: '12px',
    },
  },
  modal: {
    min: {
      width: 'min(100vw, 400px)',
    },
    background: {
      color: 'rgb(0 0 0 / 50%)',
    },
  },
  form: {
    label: {
      transform: 'uppercase',
    },
  },
};
