import { TemplateResult } from 'lit';
import { FormFieldDefinition, FormValues } from '../models';

export interface FormRenderer {
  /**
   *
   * @param data list of fields to render
   * @param values values of fields
   * @param keyFn method that returns unique key for each field to perform re-rendering process
   *
   */
  buildForm(
    data?: FormFieldDefinition[],
    values?: FormValues,
    keyFn?: (field: FormFieldDefinition) => string
  ): TemplateResult | void;
}

export const FormRenderer = 'oryx.FormRenderer';

declare global {
  interface InjectionTokensContractMap {
    [FormRenderer]: FormRenderer;
  }
}
