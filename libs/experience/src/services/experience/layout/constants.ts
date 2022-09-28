import { ScreenSize } from './model';

export const enum Breakpoint {
  Xs = 'xs',
  Md = 'md',
  Lg = 'lg',
}

export const screenSizes: Map<Breakpoint, ScreenSize> = new Map()
  .set(Breakpoint.Xs, {})
  .set(Breakpoint.Md, { min: 767 }) //, max: 1007
  .set(Breakpoint.Lg, { min: 1008 });
