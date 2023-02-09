import { ResourceGraphic } from '@spryker-oryx/core';
import { ComponentSchema } from '../../../decorators';

export const enum MessageType {
  Graphics = 'oryx.graphics',
  Options = 'oryx.options',
  Products = 'oryx.products',
  Query = 'oryx.query',
  Model = 'oryx.component-model',
  ComponentType = 'oryx.component-type',
  Schemas = 'oryx.component-schemas',
}

export interface ExperienceProductData {
  sku?: string;
  name?: string;
}

export type ExperienceMessageData<T> = {
  type: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: T extends MessageType.Graphics
    ? (keyof ResourceGraphic)[]
    : T extends MessageType.Options
    ? FeatureOptions[keyof FeatureOptions]
    : T extends MessageType.Products
    ? ExperienceProductData[]
    : T extends MessageType.Query | MessageType.ComponentType
    ? string
    : T extends MessageType.Schemas
    ? ComponentSchema[] | undefined
    : never;
  [key: string]: any;
};

export type ExperienceMessageType<T = MessageType> = MessageEvent<
  ExperienceMessageData<T>
>;
