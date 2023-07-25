import { DirectiveResult } from 'lit/directive.js';

export type FormFieldAttributes = Record<string, string | number | boolean>;

export interface FormFieldOption {
  value: string;
  text?: DirectiveResult | string;
  icon?: string;
}

export const enum FormFieldType {
  ToggleButton = 'toggle-button',
  Text = 'text',
  Email = 'email',
  Number = 'number',
  Phone = 'tel',
  Toggle = 'toggle',
  Select = 'select',
  Boolean = 'boolean',
  Textarea = 'textarea',
  Color = 'color',
  RadioList = 'radio-list',
}

export interface FormFieldDefinition<K = string>
  extends Partial<FieldValidationPattern> {
  id: K;
  type?: FormFieldType | string;
  label?: DirectiveResult | string;
  floatLabel?: boolean;
  required?: boolean;
  options?: FormFieldOption[];
  attributes?: FormFieldAttributes;
  placeholder?: DirectiveResult | string;
  max?: number;
  min?: number;
  /**
   * Indicates the width of the field editor, either 50 or 100.
   *
   * @default 50
   */
  width?: 50 | 100;

  disabled?: boolean;
}

export type FormValues = Record<string, string | boolean>;

export interface FieldValidationPattern {
  pattern?: string;
  title?: DirectiveResult | string;
}
