import { inject, INJECTOR } from '@spryker-oryx/di';
import { i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import {
  FieldValidationPattern,
  FormFieldDefinition,
  FormFieldType,
  FormValues,
} from '../models';
import { FormRenderer } from './form.renderer';
import { FormFieldRenderer } from './renderer';

export class DefaultFormRenderer implements FormRenderer {
  constructor(protected injector = inject(INJECTOR)) {}

  buildForm(
    data?: FormFieldDefinition[],
    values?: FormValues,
    keyFn: (field: FormFieldDefinition) => string = (
      field: FormFieldDefinition
    ): string => field.id
  ): TemplateResult | void {
    if (!data) return;
    return html`${repeat(
      data,
      keyFn,
      (field: FormFieldDefinition): TemplateResult =>
        html`${this.buildField(field, values?.[field.id])}`
    )}`;
  }

  protected fieldValidationPattern(
    field: FormFieldDefinition
  ): FieldValidationPattern {
    const { required, pattern, title, type } = field;
    return {
      pattern:
        pattern ??
        (type !== FormFieldType.Email && required ? '.*\\S+.*' : undefined),
      title:
        title ??
        (required ? i18n('form.validation.invalid-empty-text') : undefined),
    };
  }

  protected formatFormData(form: HTMLFormElement): unknown {
    const formData = new FormData(form);
    let formatted = {};
    for (const [name, value] of formData) {
      const el: HTMLFormElement | null = form.querySelector(`[name=${name}]`);
      formatted = {
        ...formatted,
        [name]: el?.type === 'checkbox' && value ? true : value,
      };
    }
    return formatted;
  }

  protected formatFormControl(
    control: HTMLInputElement | HTMLSelectElement
  ): Record<string, unknown> {
    let value;
    if (control instanceof HTMLInputElement && control.type === 'checkbox') {
      value = !!control.checked;
    } else if (
      control instanceof HTMLInputElement &&
      control.type === 'number'
    ) {
      value = Number(control.value);
    } else {
      value = control.value;
    }

    return {
      [control.name]: value,
    };
  }

  protected buildField(
    field: FormFieldDefinition,
    value?: string | boolean
  ): TemplateResult {
    if (!field.label || field.label === '') {
      field.label = this.resolveLabel(field.id);
    }

    const template = this.injector.inject(
      `${FormFieldRenderer}-${field.type}`,
      null
    );
    if (template) {
      return template.render(field, value);
    }
    switch (field.type) {
      case 'input':
      case FormFieldType.Text:
      case FormFieldType.Phone:
      case FormFieldType.Email: {
        return this.buildTextField(field, value as string);
      }
      case FormFieldType.Number: {
        return this.buildNumberField(field, value as string);
      }
      case FormFieldType.Textarea: {
        return this.buildTextArea(field, value as string);
      }
      case FormFieldType.Boolean: {
        return this.buildBoolean(field, value as string);
      }
      case FormFieldType.Select: {
        return this.buildSelect(field, value as string);
      }
      case FormFieldType.Toggle: {
        return this.buildToggle(field, value);
      }
      case FormFieldType.ToggleButton: {
        return this.buildToggleButton(field, value as string);
      }
      case FormFieldType.Color: {
        return this.buildColorField(field, value as string);
      }
      case FormFieldType.RadioList: {
        return this.buildRadioList(field, value as string);
      }
    }

    return html``;
  }

  protected buildTextField(
    field: FormFieldDefinition,
    value?: string
  ): TemplateResult {
    const { pattern, title } = this.fieldValidationPattern(field);

    return html`
      <oryx-input
        .label=${field.label}
        floatLabel=${ifDefined(field.floatLabel)}
        .style=${this.resolveStyles(field)}
      >
        <input
          .name=${field.id}
          .value=${value ?? ''}
          value=${value ?? ''}
          placeholder=${ifDefined(field.placeholder)}
          minlength=${ifDefined(field.min)}
          maxlength=${ifDefined(field.max)}
          type=${ifDefined(field.attributes?.type ?? field.type)}
          ?required=${field.required}
          pattern=${ifDefined(pattern)}
          title=${ifDefined(title)}
        />
      </oryx-input>
    `;
  }

  protected buildNumberField(
    field: FormFieldDefinition,
    value?: string
  ): TemplateResult {
    const { pattern, title } = this.fieldValidationPattern(field);
    return html`
      <oryx-input
        .label=${field.label}
        floatLabel=${ifDefined(field.floatLabel)}
        .style=${this.resolveStyles(field)}
      >
        <input
          name=${field.id}
          value=${value ?? ''}
          placeholder=${ifDefined(field.placeholder)}
          type="number"
          min=${ifDefined(field.min)}
          max=${ifDefined(field.max)}
          ?required=${field.required}
          pattern=${ifDefined(pattern)}
          title=${ifDefined(title)}
        />
      </oryx-input>
    `;
  }

  protected buildBoolean(
    field: FormFieldDefinition,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-checkbox
        .required=${field.required}
        .style=${this.resolveStyles(field)}
      >
        <input
          type="checkbox"
          .name=${field.id}
          ?checked=${!!value}
          ?required=${field.required}
        />
        ${field.label}
      </oryx-checkbox>
    `;
  }

  protected buildTextArea(
    field: FormFieldDefinition,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-input
        .label=${field.label}
        floatLabel=${ifDefined(field.floatLabel)}
        .style=${this.resolveStyles(field)}
      >
        <textarea
          .name=${field.id}
          .value=${value ?? ''}
          placeholder=${ifDefined(field.placeholder)}
          ?required=${field.required}
        ></textarea>
      </oryx-input>
    `;
  }

  protected buildColorField(
    field: FormFieldDefinition,
    value: string
  ): TemplateResult {
    return html`
      <oryx-input
        .label=${field.label}
        floatLabel=${ifDefined(field.floatLabel)}
        .style=${this.resolveStyles(field)}
      >
        <input
          type="color"
          .name=${field.id}
          value=${value ?? ''}
          placeholder=${ifDefined(field.placeholder)}
          ?required=${field.required}
        />
      </oryx-input>
    `;
  }

  protected buildToggle(
    field: FormFieldDefinition,
    value?: string | boolean
  ): TemplateResult {
    return html`
      <oryx-toggle .style=${this.resolveStyles(field)}>
        <input
          type="checkbox"
          .name=${field.id}
          ?checked=${!!value}
          ?required=${field.required}
        />
        ${field.label}
      </oryx-toggle>
    `;
  }

  protected buildToggleButton(
    field: FormFieldDefinition,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-input-list
        .heading=${field.label}
        .style=${this.resolveStyles(field)}
      >
        ${field.options?.map(
          (option) => html`
            <oryx-toggle-icon>
              <input
                type="radio"
                placeholder=${ifDefined(field.label)}
                .name=${field.id}
                value=${option.value}
                ?checked=${option.value === value}
                ?required=${field.required}
              />
              <oryx-icon .type=${ifDefined(option.icon)}></oryx-icon>
              ${when(option.text, () => html`<span>${option.text}</span>`)}
              <span>${option.value}</span>
            </oryx-toggle-icon>
          `
        )}
      </oryx-input-list>
    `;
  }

  protected buildSelect(
    field: FormFieldDefinition,
    value?: string
  ): TemplateResult {
    //oryx.close event that is dispatched by oryx-popover inside
    //is bubbling up and can affect other parent component
    //need to prevent propagation of it
    return html`
      <oryx-select
        .label=${field.label}
        .style=${this.resolveStyles(field)}
        floatLabel=${ifDefined(field.floatLabel)}
        @oryx.close=${(e: Event): void => e.stopPropagation()}
      >
        <select
          .name=${field.id}
          ?disabled=${field.disabled}
          ?required=${field.required}
        >
          ${when(
            field.placeholder || field.floatLabel,
            () =>
              html`<option value="" hidden>
                ${field.placeholder ?? field.label}
              </option>`,
            () => html`<option></option>`
          )}
          ${field.options?.map(
            (option) => html`<option
              value=${option.value}
              ?selected=${option.value === value}
            >
              ${option?.text ?? option?.value}
            </option>`
          )}
        </select>
      </oryx-select>
    `;
  }

  protected buildRadioList(
    field: FormFieldDefinition,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-input-list
        heading=${ifDefined(field.label)}
        direction=${ifDefined(field.attributes?.direction)}
        .style=${this.resolveStyles(field)}
      >
        ${field.options?.map(
          (option) => html`
            <oryx-radio>
              <input
                type="radio"
                name=${field.id}
                value=${option.value}
                ?checked=${option.value === value}
                ?required=${field.required}
              />
              ${option.text ?? option.value}
            </oryx-radio>
          `
        )}
      </oryx-input-list>
    `;
  }

  protected resolveStyles(params: FormFieldDefinition): string | void {
    if (params.width === 100) {
      return `grid-column: auto / span 2;`;
    }
  }

  /**
   * Adds spaces before capitalized letters in a string and lowercases the letter following a
   * capital letter.
   *
   * @param label The input string.
   * @returns The modified string.
   */
  protected resolveLabel(label: string): string {
    return label.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  }
}
