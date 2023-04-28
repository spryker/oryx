import {
  Breakpoint,
  CssStyles,
  CssStylesWithMedia,
  DefaultMedia,
} from '../model';

export const screenCss = (
  params: Record<string, CssStyles> | Record<Breakpoint, CssStyles>
): CssStylesWithMedia[] => {
  return Object.entries(params).map(([bp, css]) => ({
    media: {
      [DefaultMedia.Screen]: bp,
    },
    css,
  }));
};
