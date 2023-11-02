import { ModeEvent } from '@spryker-oryx/ui/color-mode-selector';
import { ContentComponentSchema } from '../../models';
import { ResourceGraphic } from '../../plugins';
import { ExperienceComponent } from '../experience-data';

export const enum MessageType {
  Graphics = 'oryx.graphics',
  Options = 'oryx.options',
  /**
   * @deprecated Since version 1.1. Use Suggestions instead.
   */
  Products = 'oryx.products',
  /**
   * @deprecated Since version 1.1. Use SuggestionQuery instead.
   */
  Query = 'oryx.query',
  Static = 'oryx.static',
  ComponentType = 'oryx.component-type',
  ComponentSchemas = 'oryx.component-schemas',
  ColorMode = 'oryx.color-mode',
  AppReady = 'oryx.app-ready',
  Icons = 'oryx.icons',
  SuggestionQuery = 'oryx.suggestion-query',
  Suggestions = 'oryx.suggestions',
}

/**
 * @deprecated Since version 1.1. Use ExperienceSuggestionsData instead.
 */
export interface ExperienceProductData {
  sku?: string;
  name?: string;
}

export interface ExperienceSuggestionQuery {
  query: string;
  entities?: string[];
}

export interface ExperienceSuggestionsData {
  sku?: string;
  name: string;
  id?: string;
  type: string;
  params?: Record<string, string>;
}

export type ExperienceSuggestionRecords =
  | Record<string, ExperienceSuggestionsData[]>
  | undefined;

export type ExperienceMessageData<T> = {
  type: T;
  data: T extends MessageType.Graphics
    ? (keyof ResourceGraphic)[]
    : T extends MessageType.Options
    ? FeatureOptions[keyof FeatureOptions]
    : T extends MessageType.Products
    ? ExperienceProductData[]
    : T extends MessageType.Suggestions
    ? ExperienceSuggestionRecords
    : T extends MessageType.Query | MessageType.ComponentType
    ? string
    : T extends MessageType.SuggestionQuery
    ? ExperienceSuggestionQuery
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
