import { ScreenSize } from './model';

export const enum Breakpoint {
  Xs = 'xs',
  Md = 'md',
  Lg = 'lg',
}

export const screenSizes: Map<Breakpoint, ScreenSize> = new Map()
  .set(Breakpoint.Xs, {})
  .set(Breakpoint.Md, { min: 768 })
  .set(Breakpoint.Lg, { min: 1024 });
