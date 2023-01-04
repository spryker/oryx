import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { ClassMapDirective } from 'lit/directives/class-map.js';
import { ComponentTypeDataFields } from '../models';

export interface FormRenderer {
  formatFormData(form: HTMLFormElement): unknown;

  formatFormControl(control: HTMLInputElement | HTMLSelectElement): unknown;

  /**
   *
   * @param data list of fields to render
   * @param values values of fields
   * @param keyFn method that returns unique key for each field to perform re-rendering process
   *
   */
  buildForm(
    data: ComponentTypeDataFields[],
    values?: Record<string, string | boolean>,
    keyFn?: (field: ComponentTypeDataFields) => string
  ): TemplateResult;

  buildField(
    field: ComponentTypeDataFields,
    value?: string | boolean
  ): TemplateResult;

  getClassMap(
    params: ComponentTypeDataFields
  ): DirectiveResult<typeof ClassMapDirective>;
}

export const FormRenderer = 'FES.FormRenderer';

declare global {
  interface InjectionTokensContractMap {
    [FormRenderer]: FormRenderer;
  }
}
