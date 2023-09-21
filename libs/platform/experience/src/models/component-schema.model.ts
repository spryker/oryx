import { FormFieldDefinition } from '@spryker-oryx/form';
import { LitElement } from 'lit';
import { ContentMixinInterface } from '../mixins';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldDefinition<K = string> extends FormFieldDefinition<K> {}

export type ComponentSchema<Options, Content> = {
  type?: string;
  name: string;
  group: string;
  category?: string;
  content?: {
    [P in keyof Content]: Omit<FieldDefinition, 'id'>;
  };
  options?: {
    [P in keyof Options]: Omit<FieldDefinition, 'id'>;
  };
  icon?: string;
};

export type ContentComponentSchema<
  Component = ContentMixinInterface<unknown, unknown>,
  CustomOptions = unknown
> = Component extends
  | ContentMixinInterface<infer Options, infer Content>
  | LitElement
  ? ComponentSchema<Options & CustomOptions, Content>
  : never;
