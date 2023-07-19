import { TemplateResult } from 'lit';
import { FormFieldDefinition } from '../models';

export const FormFieldRenderer = 'oryx.FormFieldRenderer';

export interface FormFieldRenderer {
  render(field: FormFieldDefinition, value?: string): TemplateResult;
}

export const getFromFieldRendererToken = (fieldType: string): string => {
  return `${FormFieldRenderer}-${fieldType}`;
};

declare global {
  interface InjectionTokensContractMap {
    [FormFieldRenderer]: FormFieldRenderer;
  }
}
