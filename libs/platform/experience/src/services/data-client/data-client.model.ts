import { ModeEvent } from '@spryker-oryx/ui/color-mode-selector';
import { ContentComponentSchema } from '../../models';
import { ResourceGraphic } from '../../plugins';
import { ExperienceComponent } from '../experience-data';

export const enum MessageType {
  Graphics = 'oryx.graphics',
  Options = 'oryx.options',
  Products = 'oryx.products',
  Query = 'oryx.query',
  Category = 'oryx.Category',
  Static = 'oryx.static',
  ComponentType = 'oryx.component-type',
  ComponentSchemas = 'oryx.component-schemas',
  ColorMode = 'oryx.color-mode',
  AppReady = 'oryx.app-ready',
  Icons = 'oryx.icons',
  Categories = 'oryx.categories',
}

/**
 * @deprecated Since version 1.1. Will be removed.
 */
export interface ExperienceProductData {
  sku?: string;
  name?: string;
}

export interface ExperienceSuggestionData {
  id?: string;
  name?: string;
}

export type ExperienceMessageData<T> = {
  type: T;
  data: T extends MessageType.Graphics
    ? (keyof ResourceGraphic)[]
    : T extends MessageType.Options
    ? FeatureOptions[keyof FeatureOptions]
    : T extends MessageType.Products | MessageType.Categories
    ? ExperienceSuggestionData[]
    : T extends
        | MessageType.Query
        | MessageType.ComponentType
        | MessageType.Category
    ? string
    : T extends MessageType.ComponentSchemas
    ? ContentComponentSchema[] | undefined
    : T extends MessageType.Static
    ? ExperienceComponent[]
    : T extends MessageType.ColorMode
    ? ModeEvent
    : T extends MessageType.AppReady
    ? null
    : T extends MessageType.Icons
    ? string[] | undefined
    : never;
};

export type ExperienceMessageType<T = MessageType> = MessageEvent<
  ExperienceMessageData<T>
>;
