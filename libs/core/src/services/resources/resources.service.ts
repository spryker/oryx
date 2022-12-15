import { LazyLoadable } from '@spryker-oryx/core/utilities';
import { Graphic } from '../../orchestration';

export const ResourceService = 'oryx.ResourceService';

export type GraphicValue =
  | (Graphic[keyof Graphic] extends LazyLoadable<infer L>
      ? Exclude<L, undefined> | Promise<Exclude<L, undefined>>
      : never)
  | undefined;

export interface ResourceService {
  getGraphicValue(token: string, key: keyof Graphic): GraphicValue;
}

declare global {
  interface InjectionTokensContractMap {
    [ResourceService]: ResourceService;
  }
}
