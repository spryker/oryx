import { FormFieldDefinition } from '@spryker-oryx/form';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldDefinition extends FormFieldDefinition {}

export interface ComponentSchema {
  type: string;
  name: string;
  group: string;
  category: string;
  content?: FieldDefinition[];
  options?: FieldDefinition[];
  icon?: string;
}
