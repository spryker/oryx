import { ThemeToken } from '@spryker-oryx/experience';

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
  form: {
    label: {
      transform: 'uppercase',
    },
  },
};
