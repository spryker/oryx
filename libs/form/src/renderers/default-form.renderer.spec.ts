import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import {
  CheckboxComponent,
  checkboxComponent,
} from '@spryker-oryx/ui/checkbox';
import { inputComponent, InputComponent } from '@spryker-oryx/ui/input';
import {
  ComponentTypeDataFields,
  FormFieldOption,
  FormFieldType,
} from '../models';
import { DefaultFormRenderer } from './default-form.renderer';
import { FormRenderer } from './form.renderer';
import { FormFieldRenderer } from './renderer';

import { componentDef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  inputListComponent,
  InputListComponent,
} from '@spryker-oryx/ui/input-list';
import { selectComponent, SelectComponent } from '@spryker-oryx/ui/select';
import { toggleComponent, ToggleComponent } from '@spryker-oryx/ui/toggle';
import { toggleIconComponent } from '@spryker-oryx/ui/toggle-icon';
import { LitElement, TemplateResult } from 'lit';

class MockFieldComponent extends LitElement {
  render(): TemplateResult {
    return html`<div>mock input</div>`;
  }
}

const mockFieldComponent = componentDef({
  name: 'mock-field',
  impl: MockFieldComponent,
});

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
    let field: ComponentTypeDataFields;

    const expectInputName = (): void => {
      it('should have an input with the field id on the name', () => {
        const input = element.querySelector('input');
        expect(input?.name).toBe(field.id);
      });
    };

    const expectInputValue = (value: string): void => {
      it('should have an input with the value', () => {
        const input = element.querySelector('input');
        expect(input?.value).toBe(value);
      });
    };

    const expectComponentType = (type: typeof HTMLElement): void => {
      it('should render the element', async () => {
        expect(element).toBeInstanceOf(type);
      });
    };

    const setup = async (
      type: string,
      value?: string | boolean,
      options?: FormFieldOption[]
    ): Promise<void> => {
      field = {
        type,
        id: 'foo',
        options,
      };
      element = await fixture(service.buildField(field, value));
    };

    describe('field label', () => {
      describe('when there is no label', () => {
        const field: ComponentTypeDataFields = {
          id: 'field-id',
          type: FormFieldType.TEXT,
        };
        beforeEach(async () => {
          await service.buildField(field);
        });
        it('should use the field id as a label', () => {
          expect(field.label).toBe('field-id');
        });
      });

      describe('when the label is empty', () => {
        const field: ComponentTypeDataFields = {
          id: 'field-id',
          type: FormFieldType.TEXT,
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
        const field: ComponentTypeDataFields = {
          id: 'field-id',
          type: FormFieldType.TEXT,
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
        const field: ComponentTypeDataFields = {
          id: 'field-id',
          type: FormFieldType.TEXT,
        };
        beforeEach(async () => {
          element = await fixture(service.buildField(field));
        });
        it('should have w50 class', () => {
          expect(element.classList.contains('w50')).toBeTruthy();
        });
      });

      describe('when the width is 100', () => {
        const field: ComponentTypeDataFields = {
          id: 'field-id',
          type: FormFieldType.TEXT,
          width: 100,
        };
        beforeEach(async () => {
          element = await fixture(service.buildField(field));
        });
        it('should have w100 class', () => {
          expect(element.classList.contains('w100')).toBeTruthy();
        });
      });

      describe('when the width is 50', () => {
        const field: ComponentTypeDataFields = {
          id: 'field-id',
          type: FormFieldType.TEXT,
          width: 50,
        };
        beforeEach(async () => {
          element = await fixture(service.buildField(field));
        });
        it('should have w50 class', () => {
          expect(element.classList.contains('w50')).toBeTruthy();
        });
      });
    });

    describe('unknown type', () => {
      describe('when an unknown field type is provided', () => {
        beforeEach(async () => {
          await setup('unknown');
        });
        it('should not have an input element', () => {
          expect(element).toBeNull();
        });
      });
    });

    describe('input', () => {
      useComponent(inputComponent);
      describe('when a legacy input field is built', () => {
        beforeEach(async () => {
          await setup('input', 'value');
        });
        expectComponentType(InputComponent);
        expectInputName();
        expectInputValue('value');
        it('should have an input element', () => {
          const input = element.querySelector('input');
          expect(input?.type).toBe('text');
        });
      });

      describe('when a required input field is built', () => {
        beforeEach(async () => {
          const field: ComponentTypeDataFields = {
            id: 'field-id',
            type: FormFieldType.TEXT,
            required: true,
          };
          element = await fixture(service.buildField(field));
        });
        expectComponentType(InputComponent);
        it('should have an input with the required attribute', () => {
          const input = element.querySelector('input');
          expect(input?.required).toBe(true);
        });
      });

      describe('when an optional input field is built', () => {
        beforeEach(async () => {
          await setup('input', 'value');
        });
        expectComponentType(InputComponent);
        it('should not have a required attribute', () => {
          const input = element.querySelector('input');
          expect(input?.required).toBe(false);
        });
      });

      describe('when a text field is built', () => {
        describe('and a value is given', () => {
          beforeEach(async () => {
            await setup(FormFieldType.TEXT, 'value');
          });
          expectComponentType(InputComponent);
          expectInputName();
          expectInputValue('value');
          it('should have an input element', () => {
            const input = element.querySelector('input');
            expect(input?.type).toBe('text');
          });
        });

        describe('and no value is given', () => {
          beforeEach(async () => {
            await setup(FormFieldType.TEXT);
          });
          expectInputValue('');
        });

        describe('and it has a range', () => {
          beforeEach(async () => {
            element = await fixture(
              service.buildField({
                id: 'field-id',
                type: 'input',
                min: 0,
                max: 50,
              })
            );
          });
          it('should have a minLength attribute', () => {
            const input = element.querySelector('input');
            expect(input?.minLength).toBe(0);
          });
          it('should have a maxLength attribute', () => {
            const input = element.querySelector('input');
            expect(input?.maxLength).toBe(50);
          });
        });
      });

      describe('when a number field is built', () => {
        describe('and a value is given', () => {
          beforeEach(async () => {
            await setup(FormFieldType.NUMBER, '0');
          });
          expectComponentType(InputComponent);
          expectInputName();
          expectInputValue('0');
          it('should have an input element', () => {
            const input = element.querySelector('input');
            expect(input?.type).toBe('number');
          });
        });

        describe('and no value is given', () => {
          beforeEach(async () => {
            await setup(FormFieldType.NUMBER);
          });
          expectInputValue('');
        });

        describe('and it has a range', () => {
          beforeEach(async () => {
            element = await fixture(
              service.buildField({
                id: 'field-id',
                type: 'number',
                min: 0,
                max: 50,
              })
            );
          });

          it('should have a min attribute', () => {
            const input = element.querySelector('input');
            expect(input?.min).toBe('0');
          });

          it('should have a max attribute', () => {
            const input = element.querySelector('input');
            expect(input?.max).toBe('50');
          });
        });
      });

      describe('when a textarea type is requested', () => {
        beforeEach(async () => {
          await setup(FormFieldType.TEXTAREA, 'rich text');
        });
        expectComponentType(InputComponent);
        it('should have an input with the field id on the name', () => {
          const textarea = element.querySelector('textarea');
          expect(textarea?.name).toBe(field.id);
        });
        it('should have an input with the field id on the name', () => {
          const textarea = element.querySelector('textarea');
          expect(textarea?.value).toBe('rich text');
        });
        it('should have an textarea element', () => {
          const textarea = element.querySelector('textarea');
          expect(textarea).toBeTruthy();
        });
      });

      describe('when a color field is built', () => {
        describe('when a value is provider', () => {
          beforeEach(async () => {
            await setup(FormFieldType.COLOR, '#ffcc00');
          });
          expectComponentType(InputComponent);
          expectInputName();
          expectInputValue('#ffcc00');
          it('should have an input element', () => {
            const input = element.querySelector('input');
            expect(input?.type).toBe('color');
          });
        });

        describe('when no value is provider', () => {
          beforeEach(async () => {
            await setup(FormFieldType.COLOR);
          });
          expectInputValue('#000000');
        });
      });
    });

    describe('when a boolean type is requested', () => {
      useComponent(checkboxComponent);
      beforeEach(async () => {
        await setup(FormFieldType.BOOLEAN, true);
      });
      expectComponentType(CheckboxComponent);
      expectInputName();
      it('should have an input with checkbox type', () => {
        const input = element.querySelector('input');
        expect(input?.type).toBe('checkbox');
      });
      describe('and the value is true', () => {
        beforeEach(async () => {
          await setup(FormFieldType.BOOLEAN, true);
        });
        it('should have a checked attribute', () => {
          const input = element.querySelector('input');
          expect(input?.checked).toBeTruthy();
        });
      });
      describe('and the value is false', () => {
        beforeEach(async () => {
          await setup(FormFieldType.BOOLEAN, false);
        });
        it('should not have a checked attribute', () => {
          const input = element.querySelector('input');
          expect(input?.checked).toBeFalsy();
        });
      });
    });

    describe('when a custom field type is requested', () => {
      const mockField = { type: 'mock', id: 'field-id', label: 'mock' };
      useComponent(mockFieldComponent);
      beforeEach(async () => {
        element = await fixture(service.buildField(mockField, ''));
      });
      expectComponentType(MockFieldComponent);
      it('should call the mock field renderer', () => {
        expect(renderer.render).toHaveBeenCalledWith(mockField, '');
      });
      it('should have custom field content', () => {
        const div = element.shadowRoot?.querySelector('div');
        expect(div?.innerText).toBe('mock input');
      });
    });

    describe('when a toggle field is built', () => {
      useComponent(inputListComponent);
      useComponent(toggleComponent);
      beforeEach(async () => {
        await setup(FormFieldType.TOGGLE);
      });
      expectComponentType(ToggleComponent);
      expectInputName();
      it('should have an input with checkbox type', () => {
        const input = element.querySelector('input');
        expect(input?.type).toBe('checkbox');
      });
      describe('and the value is true', () => {
        beforeEach(async () => {
          await setup(FormFieldType.TOGGLE, true);
        });
        it('should have a checked attribute', () => {
          const input = element.querySelector('input');
          expect(input?.checked).toBeTruthy();
        });
      });
      describe('and the value is false', () => {
        beforeEach(async () => {
          await setup(FormFieldType.TOGGLE, false);
        });
        it('should not have a checked attribute', () => {
          const input = element.querySelector('input');
          expect(input?.checked).toBeFalsy();
        });
      });
    });

    describe('when a toggle icon field is built', () => {
      useComponent(toggleIconComponent);
      const options = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];
      beforeEach(async () => {
        await setup(FormFieldType.TOGGLE_BUTTON, 'b', options);
      });
      expectComponentType(InputListComponent);

      it('should have 3 toggle-icon option', () => {
        const toggleIcons = element.querySelectorAll('oryx-toggle-icon');
        expect(toggleIcons.length).toBe(3);
      });

      options.forEach((option) => {
        it('should have a toggle-icon for each option', () => {
          const input = element.querySelectorAll(
            `input[value="${option.value}"]`
          );
          expect(input).toBeTruthy();
        });
      });

      it('should select the right option for the value', () => {
        const input = element.querySelectorAll(`input[value="b"][checked]`);
        expect(input).toBeTruthy();
      });

      describe('when there is a text per option', () => {
        const options = [
          { value: 'a', text: 'alpha' },
          { value: 'b', text: 'beta' },
          { value: 'c', text: 'charlie' },
        ];
        beforeEach(async () => {
          await setup(FormFieldType.TOGGLE_BUTTON, 'b', options);
        });
        options.forEach((option) => {
          it(`should render the text "${option.text}" inside the button`, () => {
            const text = element.querySelector(
              `input[value="${option.value}"] ~ span`
            );
            expect(text?.textContent?.trim()).toBe(option.text);
          });
        });
      });

      describe('when there is an icon per option', () => {
        const options = [
          { value: 'a', icon: 'alpha' },
          { value: 'b', icon: 'beta' },
          { value: 'c', icon: 'charlie' },
        ];
        beforeEach(async () => {
          await setup(FormFieldType.TOGGLE_BUTTON, 'b', options);
        });
        options.forEach((option) => {
          it(`should render an oryx-icon for the icon type (${option.icon}) inside the button`, () => {
            const icon = element.querySelector(
              `input[value="${option.value}"] + oryx-icon`
            );
            expect(icon?.getAttribute('type')).toBe(option.icon);
          });
        });
      });
    });

    describe('when a select field is built', () => {
      useComponent(selectComponent);
      describe('when a value is provided', () => {
        const options = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];
        beforeEach(async () => {
          await setup(FormFieldType.SELECT, 'b', options);
        });
        expectComponentType(SelectComponent);
        it('should have a selected option', () => {
          const select = element?.querySelector('option[selected');
          expect(select?.textContent?.trim()).toBe('b');
        });
      });
      describe('when no value is provided', () => {
        const options = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];
        beforeEach(async () => {
          await setup(FormFieldType.SELECT, undefined, options);
        });
        expectComponentType(SelectComponent);

        it('should not have a selected option', () => {
          const select = element?.querySelector('option[selected');
          expect(select).toBeFalsy();
        });
      });
    });
  });
});
