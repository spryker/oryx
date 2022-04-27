import { DrawerService } from '../..';

export const toggle = (force?: boolean): void | void =>
  new DrawerService().toggle({ force });
export const wait = async (t: number): Promise<void> =>
  await new Promise((r) => setTimeout(r, t));
