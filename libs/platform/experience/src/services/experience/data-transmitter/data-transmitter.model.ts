import { ResourceGraphic } from '@spryker-oryx/core';

export const enum MessageType {
  RequestGraphics = 'oryx.graphics-preview-request',
  RequestOptions = 'oryx.options-preview-request',
  RequestProduct = 'oryx.products-preview-request',
  ResponseQuery = 'oryx.query-preview-response',
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

export type ExperienceMessageData<T extends MessageType> =
  T extends MessageType.RequestGraphics
    ? { [DataIds.Graphics]: (keyof ResourceGraphic)[] }
    : T extends MessageType.RequestOptions
    ? { [DataIds.Options]: FeatureOptions }
    : T extends MessageType.RequestProduct
    ? { [DataIds.Products]: ExperienceProductData[] }
    : T extends MessageType.ResponseQuery
    ? { [DataIds.Query]: string }
    : never;

export type ExperienceMessageType<T extends MessageType> = MessageEvent<
  ExperienceMessageData<T> & {
    type: T;
  }
>;
