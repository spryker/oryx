import { ResourceGraphic } from '@spryker-oryx/core';

export const enum MessageType {
  Graphics = 'oryx.graphics-preview',
  Options = 'oryx.options-preview',
  Products = 'oryx.products-preview',
  Query = 'oryx.query-preview',
  ComponentType = 'oryx.component-type-preview',
}

export const enum DataIds {
  Graphics = 'oryx.graphics',
  Options = 'oryx.options',
  Products = 'oryx.products',
  Query = 'oryx.query',
  ComponentType = 'oryx.component-type',
}

export interface ExperienceProductData {
  sku?: string;
  name?: string;
}

export type ExperienceMessageData<T> = {
  type: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
} & (T extends MessageType.Graphics
  ? { [DataIds.Graphics]: (keyof ResourceGraphic)[] }
  : T extends MessageType.Options
  ? { [DataIds.Options]: FeatureOptions[keyof FeatureOptions] }
  : T extends MessageType.Products
  ? { [DataIds.Products]: ExperienceProductData[] }
  : T extends MessageType.Query
  ? { [DataIds.Query]: string }
  : T extends MessageType.ComponentType
  ? { [DataIds.ComponentType]: string }
  : never);

export type ExperienceMessageType<T = MessageType> = MessageEvent<
  ExperienceMessageData<T>
>;
