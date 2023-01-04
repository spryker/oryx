import { DrawerService } from '../../index';

export const toggle = (force?: boolean): void | void =>
  new DrawerService().toggle({ force });
