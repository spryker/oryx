import { CSSResult, unsafeCSS } from 'lit';

export const cssColorVar = (
  type: 'primary' | 'secondary' | 'neutral' = 'primary',
  shade: 'ink' | `base` | 'light' | 'lighter' | 'dark' | 'darker' = 'base',
  fallback?: string
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

  if (fallback) fallback = `, ${fallback}`;

  return unsafeCSS(`var(--oryx-color-${type}-${num()}${fallback ?? ''})`);
};

export const primaryColorBase = cssColorVar();
export const primaryColorInk = cssColorVar('primary', 'ink');
export const primaryColorLight = cssColorVar('primary', 'light');
export const primaryColorLighter = cssColorVar('primary', 'lighter');
export const primaryColorDark = cssColorVar('primary', 'dark');
export const primaryColorDarker = cssColorVar('primary', 'darker');

export const secondaryColorBase = cssColorVar('secondary');
export const secondaryColorLight = cssColorVar('secondary', 'light');
export const secondaryColorLighter = cssColorVar('secondary', 'lighter');
export const secondaryColorDark = cssColorVar('secondary', 'dark');
export const secondaryColorDarker = cssColorVar('secondary', 'darker');
