import { CSSResult, unsafeCSS } from 'lit';

export const color = (
  type: 'primary' | 'secondary' | 'neutral' = 'primary',
  shade: 'ink' | `base` | 'light' | 'lighter' | 'dark' | 'darker' = 'base',
  fallback = ''
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

  return unsafeCSS(`var(--oryx-color-${type}-${num()}${fallback})`);
};

export const primaryColor = (
  shade: 'ink' | `base` | 'light' | 'lighter' | 'dark' | 'darker' = 'base',
  fallback = ''
): CSSResult => {
  return color('primary', shade, fallback);
};
