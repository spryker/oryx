import { ResourceGraphic } from '@spryker-oryx/core';

export const enum MessageType {
  Graphics = 'oryx.graphics-preview',
  Options = 'oryx.options-preview',
  Products = 'oryx.products-preview',
  Query = 'oryx.query-preview',
}

export const enum DataIds {
  Graphics = 'oryx-graphics',
  Options = 'oryx-options',
  Products = 'oryx-products',
  Query = 'oryx-query',
}

export interface ExperienceProductData {
  sku?: string;
  name?: string;
}

export type ExperienceMessageData<T> = {
  type: T;
} & (T extends MessageType.Graphics
  ? { [DataIds.Graphics]: (keyof ResourceGraphic)[] }
  : T extends MessageType.Options
  ? { [DataIds.Options]: FeatureOptions }
  : T extends MessageType.Products
  ? { [DataIds.Products]: ExperienceProductData[] }
  : T extends MessageType.Query
  ? { [DataIds.Query]: string }
  : never);

export type ExperienceMessageType<T extends MessageType> = MessageEvent<
  ExperienceMessageData<T>
>;
