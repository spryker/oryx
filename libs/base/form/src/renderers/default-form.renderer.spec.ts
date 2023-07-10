import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormFieldDefinition, FormFieldType } from '../models';
import { DefaultFormRenderer } from './default-form.renderer';
import { FormRenderer } from './form.renderer';
import { FormFieldRenderer } from './renderer';

@customElement('mock-form')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockFormComponent extends LitElement {
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

@customElement('mock-field')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockFieldComponent extends LitElement {
  render(): TemplateResult {
    return html`<div></div>`;
  }
}

class MockRenderer {
  render = vi.fn().mockReturnValue(html`<mock-field></mock-field>`);
}

const mockRenderer = `${FormFieldRenderer}-mock`;

const inputFields = [
  { type: FormFieldType.Text },
  { type: FormFieldType.Phone },
  { type: FormFieldType.Email },
  { type: FormFieldType.Number },
];

describe('DefaultFormRenderer', () => {
  let element: MockFormComponent;
  let service: FormRenderer;
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

    service = testInjector.inject(FormRenderer);
    renderer = testInjector.inject(mockRenderer);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultFormRenderer);
  });

  describe('build', () => {
    const mockForm = async (
      field: FormFieldDefinition,
      value?: Record<string, string | boolean>
    ) =>
      (element = await fixture(
        html`<mock-form>${service.buildForm([field], value)} </mock-form>`
      ));

    describe('text fields', () => {
      inputFields.forEach((f: { type: FormFieldType }) => {
        describe(f.type, () => {
          describe(`when a value is provided`, () => {
            beforeEach(async () => {
              element = await mockForm(
                {
                  id: 'f',
                  type: f.type,
                },
                { f: 'v' }
              );
            });

            it('should render the value', () => {
              expect(element).toContainElement(`input[value='v']`);
            });
          });

          describe(`when a value is not provided`, () => {
            beforeEach(async () => {
              element = await mockForm({
                id: 'f',
                type: f.type,
              });
            });

            it('should not render the value', () => {
              expect(element).toContainElement(`input[value='']`);
            });
          });

          describe(`when a pattern is provided`, () => {
            beforeEach(async () => {
              element = await mockForm({
                id: 'f',
                type: f.type,
                pattern: 'p',
              });
            });

            it('should add the pattern as attribute', () => {
              expect(element).toContainElement(`input[pattern='p']`);
            });
          });

          describe(`when a placeholder is provided`, () => {
            beforeEach(async () => {
              element = await mockForm({
                id: 'f',
                type: f.type,
                placeholder: 'p',
              });
            });

            it('should render the placeholder', () => {
              expect(element).toContainElement(`input[placeholder='p']`);
            });
          });

          describe(`when a placeholder is not provided `, () => {
            beforeEach(async () => {
              element = await mockForm({
                id: 'f',
                type: f.type,
              });
            });

            it('should render the placeholder', () => {
              expect(element).toContainElement(`input:not([placeholder])`);
            });
          });
        });
      });
    });

    describe('when the field type is number', () => {
      describe('and a min length is provided', () => {
        beforeEach(async () => {
          element = await mockForm({
            id: 'foo',
            type: FormFieldType.Number,
            min: 5,
          });
        });

        it('should add the min attribute', () => {
          expect(element).toContainElement(`input[min='5']`);
        });
      });

      describe('and a max length is provided', () => {
        beforeEach(async () => {
          element = await mockForm({
            id: 'foo',
            type: FormFieldType.Number,
            max: 5,
          });
        });

        it('should add the max attribute', () => {
          expect(element).toContainElement(`input[max='5']`);
        });
      });
    });

    describe('when the field type is boolean', () => {
      describe('and there is no value', () => {
        beforeEach(async () => {
          element = await mockForm({
            id: 'f',
            type: FormFieldType.Boolean,
          });
        });

        it('should render a checkbox component', () => {
          expect(element).toContainElement(
            `oryx-checkbox input[name="f"][type="checkbox"]:not([checked])`
          );
        });
      });

      describe('and there is a value', () => {
        beforeEach(async () => {
          element = await mockForm(
            { id: 'f', type: FormFieldType.Boolean },
            { f: true }
          );
        });

        it('should render a checked checkbox component', () => {
          expect(element).toContainElement(
            `oryx-checkbox input[name="f"][type="checkbox"][checked]`
          );
        });
      });
    });

    describe('required', () => {
      [
        ...inputFields,
        { type: FormFieldType.Textarea, selector: 'textarea' },
        { type: FormFieldType.Boolean },
        { type: FormFieldType.Select, selector: 'select' },
        { type: FormFieldType.Toggle },
      ].forEach((f: { type: FormFieldType; selector?: string }) => {
        describe(`when the ${f.type} field is required`, () => {
          beforeEach(async () => {
            element = await mockForm({ id: 'f', type: f.type, required: true });
          });

          it('should render a required field', () => {
            expect(element).toContainElement(
              `${f.selector ?? 'input'}[required]`
            );
          });
        });

        describe(`when the  ${f.type} field is not required`, () => {
          beforeEach(async () => {
            element = await mockForm({ id: 'f', type: f.type });
          });

          it('should render a required field', () => {
            expect(element).toContainElement(
              `${f.selector ?? 'input'}:not([required])`
            );
          });
        });
      });

      [
        { type: FormFieldType.ToggleButton },
        { type: FormFieldType.RadioList },
      ].forEach((f) => {
        describe(`when the ${f.type} field is required`, () => {
          beforeEach(async () => {
            element = await mockForm({
              id: 'f',
              type: f.type,
              required: true,
              options: [{ value: 'foo' }, { value: 'bar' }],
            });
          });

          it('should mark each option as a required field', () => {
            const list = element.querySelector('oryx-input-list');
            expect(list).toContainElement(`input[required][value='foo']`);
            expect(list).toContainElement(`input[required][value='bar']`);
          });
        });

        describe(`when the ${f.type} field is not required`, () => {
          beforeEach(async () => {
            element = await mockForm({
              id: 'f',
              type: f.type,
              options: [{ value: 'foo' }, { value: 'bar' }],
            });
          });

          it('should not mark each option as a required field', () => {
            const list = element.querySelector('oryx-input-list');
            expect(list).toContainElement(`input:not([required])[value='foo']`);
            expect(list).toContainElement(`input:not([required])[value='bar']`);
          });
        });
      });
    });

    describe('style', () => {
      [
        ...inputFields,
        { type: FormFieldType.Textarea },
        { type: FormFieldType.Boolean, selector: 'oryx-checkbox' },
        { type: FormFieldType.Select, selector: 'oryx-select' },
        { type: FormFieldType.Toggle, selector: 'oryx-toggle' },
        { type: FormFieldType.ToggleButton, selector: 'oryx-input-list' },
        { type: FormFieldType.RadioList, selector: 'oryx-input-list' },
      ].forEach((f: { type: FormFieldType; selector?: string }) => {
        describe(`when the ${f.type} field has a width of 100`, () => {
          beforeEach(async () => {
            element = await mockForm({ id: 'f', type: f.type, width: 100 });
          });

          it('should render the style', () => {
            const input = element.querySelector(f.selector ?? 'oryx-input');

            expect(input?.getAttribute('style')).toContain(
              'grid-column: auto / span 2'
            );
          });
        });

        describe(`when the ${f.type} field has no width`, () => {
          beforeEach(async () => {
            element = await mockForm({ id: 'f', type: f.type });
          });

          it('should not render a style', () => {
            const input = element.querySelector(f.selector ?? 'oryx-input');
            expect(input?.getAttribute('style')).toBe('');
          });
        });
      });
    });

    describe('floating label', () => {
      [
        ...inputFields,
        { type: FormFieldType.Textarea },
        { type: FormFieldType.Select, selector: 'oryx-select' },
      ].forEach((f: { type: FormFieldType; selector?: string }) => {
        describe(`when the ${f.type} field has a floating label`, () => {
          beforeEach(async () => {
            element = await mockForm({
              id: 'f',
              type: f.type,
              floatLabel: true,
            });
          });

          it('should render a floating label', () => {
            expect(element).toContainElement(
              `${f.selector ?? 'oryx-input'}[floatLabel]`
            );
          });
        });

        describe(`when the ${f.type} field has no floating label`, () => {
          beforeEach(async () => {
            element = await mockForm({ id: 'f', type: f.type });
          });

          it('should not render a floating label', () => {
            expect(element).toContainElement(
              `${f.selector ?? 'oryx-input'}:not([floatLabel])`
            );
          });
        });
      });
    });

    describe('custom renderer', () => {
      describe('when a custom field type is requested', () => {
        const field = { id: 'foo', type: 'mock' };

        beforeEach(async () => {
          element = await mockForm(field);
        });

        it('should render the element', () => {
          expect(element).toContainElement('mock-field');
        });

        it('should call the mock field renderer', () => {
          expect(renderer.render).toHaveBeenCalledWith(field, undefined);
        });

        it('should have custom field content', () => {
          const customFieldElement = element.querySelector('mock-field');
          expect(customFieldElement).toContainElement('div');
        });
      });
    });
  });
});
