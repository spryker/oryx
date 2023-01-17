import { inject, INJECTOR } from '@spryker-oryx/di';
import { html, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { classMap, ClassMapDirective } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { ComponentTypeDataFields, FormFieldType } from '../models';
import { FormRenderer } from './form.renderer';
import { FormFieldRenderer } from './renderer';

export class DefaultFormRenderer implements FormRenderer {
  constructor(protected injector = inject(INJECTOR)) {}

  formatFormData(form: HTMLFormElement): unknown {
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

  formatFormControl(control: HTMLInputElement | HTMLSelectElement): unknown {
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

  buildForm(
    data: ComponentTypeDataFields[],
    values?: Record<string, string | boolean>,
    keyFn: (field: ComponentTypeDataFields) => string = (
      field: ComponentTypeDataFields
    ): string => field.id
  ): TemplateResult {
    return html`${repeat(
      data,
      keyFn,
      (field: ComponentTypeDataFields): TemplateResult =>
        html`${this.buildField(field, values?.[field.id])}`
    )}`;
  }

  buildField(
    field: ComponentTypeDataFields,
    value?: string | boolean
  ): TemplateResult {
    if (!field.label || field.label === '') {
      field.label = field.id;
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
      case FormFieldType.PHONE:
      case FormFieldType.EMAIL:
      case FormFieldType.TEXT: {
        return this.buildTextField(field, value as string);
      }
      case FormFieldType.NUMBER: {
        return this.buildNumberField(field, value as string);
      }
      case FormFieldType.TEXTAREA: {
        return this.buildTextArea(field, value as string);
      }
      case FormFieldType.BOOLEAN: {
        return this.buildBoolean(field, value as string);
      }
      case FormFieldType.SELECT: {
        return this.buildSelect(field, value as string);
      }
      case FormFieldType.TOGGLE: {
        return this.buildToggle(field, value);
      }
      case FormFieldType.TOGGLE_BUTTON: {
        return this.buildToggleButton(field, value as string);
      }
      case FormFieldType.COLOR: {
        return this.buildColorField(field, value as string);
      }
    }

    return html``;
  }

  protected buildTextField(
    field: ComponentTypeDataFields,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-input
        .label=${field.label}
        floatLabel=${ifDefined(field.floatLabel)}
        class=${this.getClassMap(field)}
      >
        <input
          .name=${field.id}
          .value=${value ?? ''}
          placeholder=${ifDefined(field.placeholder)}
          minlength=${ifDefined(field.min)}
          maxlength=${ifDefined(field.max)}
          type=${ifDefined(field.attributes?.type ?? field.type)}
          ?required=${field.required}
        />
      </oryx-input>
    `;
  }

  protected buildNumberField(
    field: ComponentTypeDataFields,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-input
        .label=${field.label}
        floatLabel=${ifDefined(field.floatLabel)}
        class=${this.getClassMap(field)}
      >
        <input
          .name=${field.id}
          .value=${value ?? ''}
          placeholder=${ifDefined(field.placeholder)}
          type="number"
          min=${ifDefined(field.min)}
          max=${ifDefined(field.max)}
          ?required=${field.required}
        />
      </oryx-input>
    `;
  }

  protected buildBoolean(
    field: ComponentTypeDataFields,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-checkbox
        class=${this.getClassMap(field)}
        .required=${field.required}
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
    field: ComponentTypeDataFields,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-input
        .label=${field.label}
        floatLabel=${ifDefined(field.floatLabel)}
        class=${this.getClassMap(field)}
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
    field: ComponentTypeDataFields,
    value: string
  ): TemplateResult {
    return html`
      <oryx-input .label=${field.label} class=${this.getClassMap(field)}>
        <input
          type="color"
          .name=${field.id}
          .value=${value ?? ''}
          ?required=${field.required}
        />
      </oryx-input>
    `;
  }

  protected buildToggle(
    field: ComponentTypeDataFields,
    value?: string | boolean
  ): TemplateResult {
    return html`
      <oryx-toggle class=${this.getClassMap(field)}>
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
    field: ComponentTypeDataFields,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-input-list .heading=${field.label} class=${this.getClassMap(field)}>
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
              <oryx-icon type=${ifDefined(option.icon)}></oryx-icon>
              ${when(option.text, () => html`<span>${option.text}</span>`)}
              <span>${option.value}</span>
            </oryx-toggle-icon>
          `
        )}
      </oryx-input-list>
    `;
  }

  protected buildSelect(
    field: ComponentTypeDataFields,
    value?: string
  ): TemplateResult {
    return html`
      <oryx-select
        .label=${field.label}
        class=${this.getClassMap(field)}
        floatLabel=${ifDefined(field.floatLabel)}
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

  getClassMap(
    params: ComponentTypeDataFields
  ): DirectiveResult<typeof ClassMapDirective> {
    return classMap({
      w100: params.width === 100,
      w50: !params.width || params.width == 50,
    });
  }
}
