import { Breakpoint } from '../../models';

export interface ResponsiveLayoutInfo {
  [key: string]: ResponsiveLayout;
}

export interface ResponsiveLayout {
  included?: Breakpoint[];
  excluded?: Breakpoint[];
}
