import {
  Breakpoint,
  CssStyles,
  CssStylesWithMedia,
  DefaultMedia,
} from '../model';

export const screenCss = (
  params: Partial<Record<Breakpoint & string, CssStyles>>
): CssStylesWithMedia[] => {
  return Object.entries(params).map(([bp, css]) => ({
    media: {
      [DefaultMedia.Screen]: bp,
    },
    css,
  }));
};
