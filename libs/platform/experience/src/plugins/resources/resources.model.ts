import { LazyLoadable } from '@spryker-oryx/core/utilities';

export interface Graphic {
  type?: string;
  url?: string;
  source?: LazyLoadable<string>;
}

export type GraphicValue =
  | (Graphic[keyof Graphic] extends LazyLoadable<infer L>
      ? Exclude<L, undefined> | Promise<Exclude<L, undefined>>
      : never)
  | undefined;

export type ResourceGraphic = Record<string, Graphic>;

export interface Resources {
  graphics?: ResourceGraphic;
}
