import { fixture, html } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormFieldDefinition, FormFieldType } from '../models';
import { DefaultFormRenderer } from './default-form.renderer';
import { FormRenderer } from './form.renderer';
import { FormFieldRenderer } from './renderer';

@customElement('mock-field')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockFieldComponent extends LitElement {
  render(): TemplateResult {
    return html`<div>mock input</div>`;
  }
}

class MockRenderer {
  render = vi.fn().mockReturnValue(html`<mock-field></mock-field>`);
}

const mockRenderer = `${FormFieldRenderer}-mock`;

describe('DefaultFormRenderer', () => {
  let service: DefaultFormRenderer;
  let renderer: MockRenderer;
  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FormRenderer,
          useClass: DefaultFormRenderer,
        },
        {
          provide: mockRenderer,
          useClass: MockRenderer,
        },
      ],
    });

    service = testInjector.inject(FormRenderer) as DefaultFormRenderer;
    renderer = testInjector.inject(mockRenderer);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('fieldValidationPattern()', () => {
    describe('when field doesn`t have validation patterns', () => {
      it('should assign default values', () => {
        const { pattern, title } = service.fieldValidationPattern({
          id: 'test',
        });

        expect(pattern).toBe('.*\\S+.*');
        expect(title).toBe('at least one character');
      });
    });

    describe('when field has own validation patterns', () => {
      const validationPattern = {
        pattern: 'testPattern',
        title: 'testTitle',
      };

      it('should assign field values', () => {
        const { pattern, title } = service.fieldValidationPattern({
          id: 'test',
          ...validationPattern,
        });

        expect(pattern).toBe(validationPattern.pattern);
        expect(title).toBe(validationPattern.title);
      });
    });
  });

  describe('formatFormData()', () => {
    let element: HTMLFormElement;

    describe('when there are no form elements', () => {
      beforeEach(async () => {
        element = await fixture(html`<form></form>`);
      });

      it('should return an empty object', () => {
        expect(service.formatFormData(element)).toStrictEqual({});
      });
    });

    describe('when a checkbox is checked', () => {
      beforeEach(async () => {
        element = await fixture(
          html`
            <form>
              <input name="foo" value="bar" />
              <input type="checkbox" checked name="checkbox" />
            </form>
          `
        );
      });

      it('should convert it to a boolean value', () => {
        expect(service.formatFormData(element)).toStrictEqual({
          foo: 'bar',
          checkbox: true,
        });
      });
    });

    describe('when a checkbox is unchecked', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<form>
            <input name="foo" value="bar" />
            <input type="checkbox" name="checkbox" />
          </form>`
        );
      });

      it('should not add the checkbox field', () => {
        expect(service.formatFormData(element)).toStrictEqual({
          foo: 'bar',
        });
      });
    });
  });

  describe('build', () => {
    let element: HTMLElement;
    let field: FormFieldDefinition;

    const expectFieldAttributeValue = (
      selector: string,
      attr: string,
      value?: string | boolean | number
    ): void => {
      it(`should have an ${selector} with proper value`, () => {
        const control = element.querySelector(selector);
        expect(control?.[attr as keyof Element]).toBe(
          attr === 'name' ? field.id : value
        );
      });
    };

    const expectComponentTag = (tag: string): void => {
      it('should render the element', () => {
        expect(element.tagName).toBe(tag.toUpperCase());
      });
    };

    const setup = async (
      definition: Partial<FormFieldDefinition>,
      value?: string | boolean
    ): Promise<void> => {
      field = {
        id: 'foo',
        ...definition,
      };
      element = await fixture(service.buildField(field, value));
    };

    describe('field label', () => {
      describe('when there is no label', () => {
        const field: FormFieldDefinition = {
          id: 'field-id',
          type: FormFieldType.Text,
        };

        beforeEach(async () => {
          await service.buildField(field);
        });

        it('should use the field id as a label', () => {
          expect(field.label).toBe('field-id');
        });
      });

      describe('when the label is empty', () => {
        const field: FormFieldDefinition = {
          id: 'field-id',
          type: FormFieldType.Text,
          label: '',
        };

        beforeEach(async () => {
          await service.buildField(field);
        });

        it('should use the field id as a label', () => {
          expect(field.label).toBe('field-id');
        });
      });

      describe('when there is a label', () => {
        const field: FormFieldDefinition = {
          id: 'field-id',
          type: FormFieldType.Text,
          label: 'my-label',
        };

        beforeEach(async () => {
          await service.buildField(field);
        });

        it('should not change the label', () => {
          expect(field.label).toBe('my-label');
        });
      });
    });

    describe('classMap', () => {
      describe('when there is no width', () => {
        const field: FormFieldDefinition = {
          id: 'field-id',
          type: FormFieldType.Text,
        };

        beforeEach(async () => {
          element = await fixture(service.buildField(field));
        });

        it('should have w50 class', () => {
          expect(element.classList.contains('w50')).toBe(true);
        });
      });

      describe('when the width is 100', () => {
        const field: FormFieldDefinition = {
          id: 'field-id',
          type: FormFieldType.Text,
          width: 100,
        };

        beforeEach(async () => {
          element = await fixture(service.buildField(field));
        });

        it('should have w100 class', () => {
          expect(element.classList.contains('w100')).toBe(true);
        });
      });

      describe('when the width is 50', () => {
        const field: FormFieldDefinition = {
          id: 'field-id',
          type: FormFieldType.Text,
          width: 50,
        };
        beforeEach(async () => {
          element = await fixture(service.buildField(field));
        });
        it('should have w50 class', () => {
          expect(element.classList.contains('w50')).toBe(true);
        });
      });
    });

    describe('unknown type', () => {
      describe('when an unknown field type is provided', () => {
        beforeEach(async () => {
          await setup({ type: 'unknown' });
        });

        it('should not have an input element', () => {
          expect(element).toBeNull();
        });
      });
    });

    describe('input', () => {
      describe('when a legacy input field is built', () => {
        beforeEach(async () => {
          await setup({ type: 'input' }, 'value');
        });

        expectComponentTag('oryx-input');
        expectFieldAttributeValue('input', 'name');
        expectFieldAttributeValue('input', 'value', 'value');
        expectFieldAttributeValue('input', 'type', 'text');
        expectFieldAttributeValue('input', 'required', false);
      });

      describe('when a required input field is built', () => {
        beforeEach(async () => {
          await setup({ type: 'input', required: true });
        });

        expectComponentTag('oryx-input');
        expectFieldAttributeValue('input', 'required', true);
      });

      describe('when a text field is built', () => {
        describe('and a value is given', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Text }, 'value');
          });

          expectComponentTag('oryx-input');
          expectFieldAttributeValue('input', 'name');
          expectFieldAttributeValue('input', 'value', 'value');
          expectFieldAttributeValue('input', 'type', 'text');
        });

        describe('and no value is given', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Text });
          });

          expectFieldAttributeValue('input', 'value', '');
        });

        describe('and it has a range', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Text, min: 4, max: 50 });
          });

          expectFieldAttributeValue('input', 'minLength', 4);
          expectFieldAttributeValue('input', 'maxLength', 50);
        });
      });

      describe('when a number field is built', () => {
        describe('and a value is given', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Number }, '0');
          });

          expectComponentTag('oryx-input');
          expectFieldAttributeValue('input', 'name');
          expectFieldAttributeValue('input', 'value', '0');
          expectFieldAttributeValue('input', 'type', 'number');
        });

        describe('and no value is given', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Number });
          });

          expectFieldAttributeValue('input', 'value', '');
        });

        describe('and it has a range', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Number, min: 4, max: 50 });
          });

          expectFieldAttributeValue('input', 'min', '4');
          expectFieldAttributeValue('input', 'max', '50');
        });
      });

      describe('when a textarea type is requested', () => {
        beforeEach(async () => {
          await setup({ type: FormFieldType.Textarea }, 'rich text');
        });

        expectComponentTag('oryx-input');
        expectFieldAttributeValue('textarea', 'name');
        expectFieldAttributeValue('textarea', 'value', 'rich text');

        it('should have an textarea element', () => {
          expect(element.querySelector('textarea')).toBeDefined();
        });
      });

      describe('when a color field is built', () => {
        describe('when a value is provider', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Color }, '#ffcc00');
          });

          expectComponentTag('oryx-input');
          expectFieldAttributeValue('input', 'name');
          expectFieldAttributeValue('input', 'value', '#ffcc00');
          expectFieldAttributeValue('input', 'type', 'color');
        });

        describe('when no value is provider', () => {
          beforeEach(async () => {
            await setup({ type: FormFieldType.Color });
          });

          expectFieldAttributeValue('input', 'value', '#000000');
        });
      });
    });

    describe('when a boolean type is requested', () => {
      beforeEach(async () => {
        await setup({ type: FormFieldType.Boolean }, true);
      });

      expectComponentTag('oryx-checkbox');
      expectFieldAttributeValue('input', 'name');
      expectFieldAttributeValue('input', 'type', 'checkbox');
      expectFieldAttributeValue('input', 'checked', true);

      describe('when no value is provider', () => {
        beforeEach(async () => {
          await setup({ type: FormFieldType.Boolean });
        });

        expectFieldAttributeValue('input', 'checked', false);
      });
    });

    describe('when a custom field type is requested', () => {
      beforeEach(async () => {
        await setup({ type: 'mock', label: 'mock' }, 'value');
      });

      expectComponentTag('mock-field');

      it('should call the mock field renderer', () => {
        expect(renderer.render).toHaveBeenCalledWith(field, 'value');
      });

      it('should have custom field content', () => {
        const div = element.shadowRoot?.querySelector('div');
        expect(div?.innerText).toBe('mock input');
      });
    });

    describe('when a toggle field is built', () => {
      beforeEach(async () => {
        await setup({ type: FormFieldType.Toggle }, true);
      });

      expectComponentTag('oryx-toggle');
      expectFieldAttributeValue('input', 'name');
      expectFieldAttributeValue('input', 'type', 'checkbox');
      expectFieldAttributeValue('input', 'checked', true);

      describe('when no value is provider', () => {
        beforeEach(async () => {
          await setup({ type: FormFieldType.Toggle });
        });

        expectFieldAttributeValue('input', 'checked', false);
      });
    });

    describe('when a toggle icon field is built', () => {
      const options = [
        { value: 'a', text: 'alpha', icon: 'alpha' },
        { value: 'b', text: 'beta', icon: 'beta' },
        { value: 'c', text: 'charlie', icon: 'charlie' },
      ];

      beforeEach(async () => {
        await setup({ type: FormFieldType.ToggleButton, options }, 'b');
      });

      expectComponentTag('oryx-input-list');

      it('should have 3 toggle-icon option', () => {
        const toggleIcons = element.querySelectorAll('oryx-toggle-icon');
        expect(toggleIcons.length).toBe(3);
      });

      options.forEach((option) => {
        it('should have a toggle-icon for each option', () => {
          expect(
            element.querySelector(`input[value="${option.value}"]`)
          ).toBeDefined();
        });

        it(`should render the text "${option.text}" inside the button`, () => {
          const text = element.querySelector(
            `input[value="${option.value}"] ~ span`
          );
          expect(text?.textContent?.trim()).toBe(option.text);
        });

        it(`should render an oryx-icon for the icon type (${option.icon}) inside the button`, () => {
          const icon = element.querySelector(
            `input[value="${option.value}"] + oryx-icon`
          );
          expect(icon?.getAttribute('type')).toBe(option.icon);
        });
      });

      it('should select the right option for the value', () => {
        expect(
          element.querySelector('input[value="b"][checked]')
        ).toBeDefined();
      });
    });

    describe('when a select field is built', () => {
      describe('when a value is provided', () => {
        const options = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];

        beforeEach(async () => {
          await setup({ type: FormFieldType.Select, options }, 'b');
        });

        expectComponentTag('oryx-select');

        it('should have a selected option', () => {
          const select = element?.querySelector('option[selected');
          expect(select?.textContent?.trim()).toBe('b');
        });
      });

      describe('when no value is provided', () => {
        const options = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];

        beforeEach(async () => {
          await setup({ type: FormFieldType.Select, options });
        });

        it('should not have a selected option', () => {
          expect(element).not.toContainElement('option[selected');
        });
      });
    });
  });
});
