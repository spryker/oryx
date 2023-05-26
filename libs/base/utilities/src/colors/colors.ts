import { CSSResult, unsafeCSS } from 'lit';

export const color = (
  type: 'primary' | 'secondary' | 'neutral' = 'primary',
  shade: 'ink' | `base` | 'light' | 'lighter' | 'dark' | 'darker' = 'base'
): CSSResult => {
  const num = () => {
    switch (shade) {
      case 'ink':
        return 0;
      case 'lighter':
        return 3;
      case 'light':
        return 7;
      case 'dark':
        return 10;
      case 'darker':
        return 12;
      case 'base':
      default:
        return 9;
    }
  };

  return unsafeCSS(`var(--oryx-color-${type}-${num()})`);
};

export const primaryBase = color();
export const primaryLight = color('primary', 'light');
export const primaryLighter = color('primary', 'lighter');
export const primaryDark = color('primary', 'dark');
export const primaryDarker = color('primary', 'darker');
