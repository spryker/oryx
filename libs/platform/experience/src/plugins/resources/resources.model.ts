import { LazyLoadable } from '@spryker-oryx/utilities';

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
export type ResourceFonts = Record<string, string>;

export interface Resources {
  graphics?: ResourceGraphic;
  fonts?: ResourceFonts;
}
