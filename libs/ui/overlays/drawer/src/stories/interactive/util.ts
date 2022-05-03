import { DrawerService } from '../..';

export const toggle = (force?: boolean): void | void =>
  new DrawerService().toggle({ force });
