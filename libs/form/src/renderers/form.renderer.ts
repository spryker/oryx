import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { ClassMapDirective } from 'lit/directives/class-map.js';
import { ComponentTypeDataFields } from '../models';

export interface FormRenderer {
  formatFormData(form: HTMLFormElement): unknown;

  formatFormControl(control: HTMLInputElement | HTMLSelectElement): unknown;

  buildForm(
    data: ComponentTypeDataFields[],
    values?: Record<string, string | boolean>
  ): TemplateResult[];

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
