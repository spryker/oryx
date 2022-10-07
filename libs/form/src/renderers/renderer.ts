import { TemplateResult } from 'lit';
import { ComponentTypeDataFields } from '../models';

export const FormFieldRenderer = 'FES.FormFieldRenderer';

export interface FormFieldRenderer {
  render(field: ComponentTypeDataFields, value?: string): TemplateResult;
}

export const getFromFieldRendererToken = (fieldType: string): string => {
  return `${FormFieldRenderer}-${fieldType}`;
};

declare global {
  interface InjectionTokensContractMap {
    [FormFieldRenderer]: FormFieldRenderer;
  }
}
