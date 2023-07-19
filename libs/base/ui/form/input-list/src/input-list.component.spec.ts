import { fixture, html } from '@open-wc/testing-helpers';
import { Direction } from '@spryker-oryx/ui';
import { useComponent } from '@spryker-oryx/utilities';
import { ErrorMessageComponent } from '../../error-message';
import { InputListComponent } from './input-list.component';
import { inputListComponent } from './input-list.def';

describe('InputListComponent', () => {
  let element: InputListComponent;

  beforeAll(async () => {
    await useComponent(inputListComponent);
  });

  it('should be defined', () => {
    const el = document.createElement('oryx-input-list');
    expect(el).toBeInstanceOf(InputListComponent);
  });

  describe('as radio list', () => {
    describe('when list has no heading', () => {
      beforeEach(async () => {
        element = await fixture<InputListComponent>(
          html`<oryx-input-list>
            <oryx-radio><input name="group" type="radio" />Option 1</oryx-radio>
            <oryx-radio><input name="group" type="radio" />Option 2</oryx-radio>
          </oryx-input-list>`
        );
      });

      it('should have no heading', () => {
        const legend = element?.shadowRoot?.querySelector('legend');

        expect(legend?.getAttribute('hasHeading')).toBeNull();
      });
    });

    describe('when list has a heading', () => {
      describe('provided as an attribute', () => {
        beforeEach(async () => {
          element = await fixture<InputListComponent>(
            html`<oryx-input-list heading="title">
              <oryx-radio>
                <input name="group" type="radio" />
                Option 1
              </oryx-radio>
              <oryx-radio>
                <input name="group" type="radio" />
                Option 2
              </oryx-radio>
            </oryx-input-list>`
          );
        });

        it('should have a heading', () => {
          const legend = element?.shadowRoot?.querySelector('legend');

          expect(legend?.getAttribute('hasHeading')).not.toBeNull();
          expect(legend?.textContent).toContain('title');
        });
      });

      describe('provided as a custom element', () => {
        beforeEach(async () => {
          element = await fixture<InputListComponent>(
            html`<oryx-input-list>
              <span slot="heading">title</span>
              <oryx-radio>
                <input name="group" type="radio" />
                Option 1
              </oryx-radio>
              <oryx-radio>
                <input name="group" type="radio" />
                Option 2
              </oryx-radio>
            </oryx-input-list>`
          );
        });

        it('should have a heading flag', () => {
          const legend = element?.shadowRoot?.querySelector('legend');
          const [heading] = legend
            ?.querySelector('slot')
            ?.assignedElements() as Element[];

          expect(legend?.getAttribute('hasHeading')).not.toBeNull();
          expect(heading?.textContent).toContain('title');
        });
      });
    });

    describe('when list has an error provided', () => {
      let errorMessage: ErrorMessageComponent | null;

      beforeEach(async () => {
        element = await fixture<InputListComponent>(
          html`<oryx-input-list errorMessage="error">
            <oryx-radio><input name="group" type="radio" />Option 1</oryx-radio>
            <oryx-radio><input name="group" type="radio" />Option 2</oryx-radio>
          </oryx-input-list>`
        );
        errorMessage =
          element?.renderRoot?.querySelector('oryx-error-message') || null;
      });

      it('the host should have hasError attribute', () => {
        expect(element?.hasAttribute('hasError')).toBe(true);
      });

      it('should pass error message to component', () => {
        expect(errorMessage?.message).toBe('error');
      });

      it('radios should have hasError attribute', () => {
        const radios = element?.querySelectorAll('oryx-radio');
        radios?.forEach((el) => expect(el.hasAttribute('hasError')).toBe(true));
      });
    });
  });

  describe('as checkbox list', () => {
    const groupData = [
      {
        label: 'Apple',
        checked: false,
      },
      {
        label: 'Orange',
        checked: true,
      },
      {
        label: 'Pear',
        checked: false,
      },
    ];

    describe('list direction', () => {
      Object.values(Direction).forEach((direction) => {
        describe(`when direction is "${direction}"`, () => {
          beforeEach(async () => {
            element = await fixture(html`<oryx-input-list
              direction="${direction}"
            ></oryx-input-list>`);
          });

          it('should reflect the direction attribute on the node', () => {
            expect(element?.getAttribute('direction')).toBe(direction);
          });
        });
      });
    });

    describe('when list has an error provided', () => {
      let errorMessage: ErrorMessageComponent | null;

      beforeEach(async () => {
        element = await fixture<InputListComponent>(
          html`<oryx-input-list errorMessage="error">
            <oryx-radio>
              <input name="group" type="radio" /> Option 1
            </oryx-radio>
            <oryx-radio>
              <input name="group" type="radio" /> Option 2
            </oryx-radio>
          </oryx-input-list>`
        );
        errorMessage =
          element?.renderRoot?.querySelector('oryx-error-message') || null;
      });

      it('the host should have hasError attribute', () => {
        expect(element?.hasAttribute('hasError')).toBe(true);
      });

      it('should pass error message to component', () => {
        expect(errorMessage?.message).toBe('error');
      });

      it('radios should have hasError attribute', () => {
        const radios = element?.querySelectorAll('oryx-radio');
        radios?.forEach((el) => expect(el.hasAttribute('hasError')).toBe(true));
      });
    });

    describe('when a list with unselected checkboxes is toggled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-input-list>
            ${groupData.map(
              (item) => html`
                <oryx-checkbox slot="inputs">
                  <input type="checkbox" name="${item.label}" />
                  ${item.label}
                </oryx-checkbox>
              `
            )}
          </oryx-input-list>`
        );
        element.toggle();
      });

      it('should select all checkboxes', () => {
        expect(
          element.querySelectorAll('oryx-checkbox input:checked').length
        ).toBe(3);
      });
    });

    describe('when a list with selected checkboxes is toggled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-input-list>
            ${groupData.map(
              (item) => html`
                <oryx-checkbox slot="inputs">
                  <input type="checkbox" name="${item.label}" checked />
                  ${item.label}
                </oryx-checkbox>
              `
            )}
          </oryx-input-list>`
        );
        element.toggle();
      });

      it('should deselect all checkboxes', () => {
        expect(
          element.querySelectorAll('oryx-checkbox input:checked').length
        ).toBe(0);
      });
    });

    describe('when a list with partial selected checkboxes is toggled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-input-list>
            ${groupData.map(
              (item) => html`
                <oryx-checkbox slot="inputs">
                  <input
                    type="checkbox"
                    name="${item.label}"
                    .checked=${item.checked}
                  />
                  ${item.label}
                </oryx-checkbox>
              `
            )}
          </oryx-input-list>`
        );
        element.toggle();
      });

      it('should select all checkboxes', () => {
        expect(
          element.querySelectorAll('oryx-checkbox input:checked').length
        ).toBe(3);
      });
    });
  });
});
