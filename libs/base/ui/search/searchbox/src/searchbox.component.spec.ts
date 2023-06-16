import { getShadowElementBySelector } from '@/tools/testing';
import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { a11yConfig, queryFirstAssigned } from '@spryker-oryx/utilities';
import { SearchboxComponent } from './searchbox.component';
import { searchboxComponent } from './searchbox.def';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchEventDetail,
  SearchIconPosition,
} from './searchbox.model';

describe('SearchComponent', () => {
  let element: SearchboxComponent;

  beforeAll(async () => {
    await useComponent(searchboxComponent);
  });

  describe('search', () => {
    describe('searchIcon', () => {
      describe('when no searchIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"><input /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the default search icon', () => {
          expect(element).toContainElement(
            `.search-button[type=${IconTypes.Search}]`
          );
        });
      });

      describe('when a searchIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              label="some label"
              searchIcon="custom-search-icon"
              }}
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the custom search icon', () => {
          expect(element).toContainElement(
            '.search-button[type=custom-search-icon]'
          );
        });
      });
    });

    describe('searchIconPosition', () => {
      const searchIcon = (slot: string): Element | undefined => {
        return queryFirstAssigned(element, {
          slot,
          selector: '.search-button',
          flatten: true,
        });
      };
      describe('when the position is undefined', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"><input /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the search icon in the prefix slot', () => {
          expect(searchIcon('prefix')).not.toBeNull();
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(searchIcon('suffix')).toBeUndefined();
        });
      });

      describe('when the searchIconPosition is Prefix', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .searchIconPosition=${SearchIconPosition.Prefix}
              label="some label"
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the search icon in the prefix slot', () => {
          expect(searchIcon('prefix')).not.toBeNull();
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(searchIcon('suffix')).toBeUndefined();
        });

        describe('and custom prefix content is slotted in', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-search label="some label"
                ><div slot="prefix">custom prefix content</div>
                <input
              /></oryx-search>`
            );
          });

          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should not render the search icon in the prefix slot', () => {
            expect(searchIcon('prefix')).toBeUndefined();
          });
        });
      });

      describe('when the searchIconPosition is Suffix', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .searchIconPosition=${SearchIconPosition.Suffix}
              label="some label"
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(searchIcon('prefix')).toBeUndefined();
        });

        it('should render the search icon in the suffix slot', () => {
          expect(searchIcon('suffix')).not.toBeNull();
        });

        describe('and custom suffix content is slotted in', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-search label="some label"
                ><input />
                <div slot="suffix">custom prefix content</div></oryx-search
              >`
            );
          });

          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should not render the search icon in the suffix slot', () => {
            expect(searchIcon('suffix')).toBeUndefined();
          });
        });
      });

      describe('when the searchIconPosition is None', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .searchIconPosition=${SearchIconPosition.None}
              label="some label"
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(element).not.toContainElement(
            'slot[name=prefix] .search-button oryx-icon'
          );
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(element).not.toContainElement(
            'slot[name=suffix] .search-button oryx-icon'
          );
        });
      });
    });

    const searchIcon = (): HTMLElement | null | undefined =>
      getShadowElementBySelector(element, '.search-button');

    const itShouldDispatchSearchEvent = (value: string): void => {
      it(`should dispatch search event (${value})`, () =>
        new Promise<void>((done) => {
          const emitter = ((ev: CustomEvent<SearchEventDetail>) => {
            expect(ev.detail?.query).toBe(value);
            done();
          }) as EventListener;
          element.addEventListener('oryx.search', emitter);
          searchIcon()?.click();
          element.removeEventListener('oryx.search', emitter);
        }));
    };

    describe('when no custom input control is given', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search><input /></oryx-search>`);
      });

      describe('and the search icon is clicked', () => {
        itShouldDispatchSearchEvent('');
      });

      describe('and the enter key is used', () => {
        it('should trigger the oryx.search event', () =>
          new Promise<void>((done) => {
            const emitter = ((ev: CustomEvent<SearchEventDetail>) => {
              expect(ev.detail?.query).toBe('');
              done();
            }) as EventListener;
            element.addEventListener('oryx.search', emitter);
            element.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Enter',
              })
            );
            element.removeEventListener('oryx.search', emitter);
          }));
      });

      describe('and when the value is changed ', () => {
        beforeEach(async () => {
          const input = element.querySelector('input') as HTMLInputElement;
          if (input) {
            input.value = 'foo-bar';
          }
        });
        itShouldDispatchSearchEvent('foo-bar');
      });
    });

    describe('when a custom input is provided with an initial value', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search>
          <input id="light" value="value123" />
        </oryx-search>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      describe('and the search icon is clicked', () => {
        itShouldDispatchSearchEvent('value123');
      });

      describe('and the enter key is used', () => {
        it('should trigger the oryx.search event', () =>
          new Promise<void>((done) => {
            const emitter = ((ev: CustomEvent<SearchEventDetail>) => {
              expect(ev.detail?.query).toBe('value123');
              done();
            }) as EventListener;
            element.addEventListener('oryx.search', emitter);
            element.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Enter',
              })
            );
            element.removeEventListener('oryx.search', emitter);
          }));
      });

      describe('and the value is changed ', () => {
        beforeEach(async () => {
          const input = element.querySelector('input');
          if (input) {
            input.value = 'foo-bar';
          }
        });
        itShouldDispatchSearchEvent('foo-bar');
      });
    });
  });

  describe('clear', () => {
    describe('clearIcon', () => {
      describe('when no clearIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"><input /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the default clear icon', () => {
          expect(element).toContainElement(
            `.clear-button[type=${IconTypes.Remove}]`
          );
        });
      });

      describe('when a clearIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              clearIcon="custom-clear-icon"
              label="some label"
              }}
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the custom clear icon', () => {
          expect(element).toContainElement(
            '.clear-button[type=custom-clear-icon]'
          );
        });
      });
    });

    describe('clearIconPosition', () => {
      const clearIcon = (slot: string): Element | undefined => {
        return queryFirstAssigned(element, {
          slot,
          selector: '.clear-button',
          flatten: true,
        });
      };
      describe('when the position is undefined', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"><input /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the clear icon after the input control', () => {
          expect(element).toContainElement('slot:not([name]) + .clear-button');
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(clearIcon('prefix')).toBeUndefined();
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(clearIcon('suffix')).toBeUndefined();
        });
      });

      describe('when the position is After', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconPosition=${ClearIconPosition.After}
              label="some label"
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the clear icon after the input control', () => {
          expect(element).toContainElement('slot:not([name]) + .clear-button');
        });

        it('should not render the clear icon in the prefix slot', () => {
          expect(clearIcon('prefix')).toBeUndefined();
        });

        it('should not render the clear icon in the suffix slot', () => {
          expect(clearIcon('suffix')).toBeUndefined();
        });
      });

      describe('when the position is Suffix', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconPosition=${ClearIconPosition.Suffix}
              label="some label"
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render the clear icon after the input control', () => {
          expect(element).not.toContainElement(
            'slot:not([name]) + .clear-button'
          );
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(clearIcon('prefix')).toBeUndefined();
        });

        it('should render the search icon in the suffix slot', () => {
          expect(clearIcon('suffix')).not.toBeNull();
        });
      });

      describe('when the position is None', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconPosition=${ClearIconPosition.None}
              label="some label"
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render the clear icon after the input control', () => {
          expect(element).not.toContainElement(
            'slot:not([name]) + .clear-button'
          );
        });

        it('should not render the clear icon in the prefix slot', () => {
          expect(clearIcon('prefix')).toBeUndefined();
        });

        it('should not render the clear icon in the suffix slot', () => {
          expect(clearIcon('suffix')).toBeUndefined();
        });
      });
    });

    describe('clearIconAppearance', () => {
      describe('when the appearance is undefined', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"><input /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should use toggle', () => {
          expect(element).toContainElement(
            '.clear-button[appearance="toggle"]'
          );
        });
      });

      describe('when the appearance is given', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconAppearance=${ClearIconAppearance.Hover}
              label="some label"
              ><input
            /></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should add the appearance on the clear icon', () => {
          expect(element).toContainElement('.clear-button[appearance="hover"]');
        });
      });
    });

    const clearIcon = (): HTMLElement | null | undefined =>
      getShadowElementBySelector(element, '.clear-button');

    describe('when the input is empty', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search label="some label"><input /></oryx-search>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should hide the clear icon', () => {
        expect(element.hasAttribute('has-value')).toBe(false);
      });

      it('should not prevent event bubbling', () => {
        const event = new KeyboardEvent('mousedown', {
          bubbles: true,
        });
        const exp1 = vi.spyOn(event, 'stopImmediatePropagation');
        const exp2 = vi.spyOn(event, 'stopPropagation');
        const exp3 = vi.spyOn(event, 'preventDefault');
        clearIcon()?.dispatchEvent(event);
        expect(exp1).not.toHaveBeenCalled();
        expect(exp2).not.toHaveBeenCalled();
        expect(exp3).not.toHaveBeenCalled();
      });
    });

    describe('when the input has an initial value', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search>
          <input value="value123" />
        </oryx-search>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have the clear icon', () => {
        expect(clearIcon()).not.toBeNull();
      });

      it('should prevent event bubbling', () => {
        const event = new KeyboardEvent('mousedown', {
          bubbles: true,
        });
        const exp1 = vi.spyOn(event, 'stopImmediatePropagation');
        const exp2 = vi.spyOn(event, 'stopPropagation');
        const exp3 = vi.spyOn(event, 'preventDefault');
        clearIcon()?.dispatchEvent(event);
        expect(exp1).toHaveBeenCalledOnce();
        expect(exp2).toHaveBeenCalledOnce();
        expect(exp3).toHaveBeenCalledOnce();
      });

      describe('but when clear icon is clicked', () => {
        it('should not have the `has-value` attribute', () => {
          clearIcon()?.click();
          expect(element.hasAttribute('has-value')).toBe(false);
        });
      });

      describe('and the input value is changed to empty', () => {
        beforeEach(() => {
          const input = element.querySelector('input');
          if (input) {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        it('should not have the `has-value` attribute', () => {
          expect(element.hasAttribute('has-value')).toBe(false);
        });
      });

      describe('and the input value is changed to foo', () => {
        beforeEach(() => {
          const input = element.querySelector('input');
          if (input) {
            input.value = 'foo';
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        it('should have the `has-value` attribute', () => {
          expect(element.hasAttribute('has-value')).toBe(true);
        });
      });

      describe('and an change event is dispatched', () => {
        beforeEach(() => {
          const input = element.querySelector('input');
          if (input) {
            input.value = 'foo';
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        it('should have the `has-value` attribute', () => {
          expect(element.hasAttribute('has-value')).toBe(true);
        });
      });
    });
  });

  describe('trigger', () => {
    describe('when trigger is clicked', () => {
      const openCallback = vi.fn();
      const closeCallback = vi.fn();

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search
            label="some label"
            @oryx.open=${openCallback}
            @oryx.close=${closeCallback}
            ><input id="input"
          /></oryx-search>`
        );

        element.renderRoot
          .querySelector('[name="trigger"')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should set "open" attribute on the host', () => {
        expect(element.hasAttribute('open')).toBe(true);
      });

      it('should focus the input', () => {
        const input = element.querySelector('#input');
        expect(input?.matches(':focus')).toBe(true);
      });

      it('should dispatches open event', () => {
        expect(openCallback).toHaveBeenCalled();
      });

      describe('and trigger is clicked again', () => {
        beforeEach(async () => {
          element.querySelector<HTMLInputElement>('#input')!.value = 'test';

          element.renderRoot
            .querySelector('[name="trigger"')
            ?.dispatchEvent(new MouseEvent('click'));
        });

        it('should remove "open" attribute from the host', () => {
          expect(element.hasAttribute('open')).toBe(false);
        });

        it('should clear input`s value', () => {
          const input = element.querySelector<HTMLInputElement>('#input');
          expect(input?.value).toBe('');
        });

        it('should dispatches close event', () => {
          expect(closeCallback).toHaveBeenCalled();
        });
      });
    });
  });

  describe('back button', () => {
    describe('when button is clicked', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search open label="some label" @oryx.close=${callback}
            ><input id="input"
          /></oryx-search>`
        );

        element.querySelector<HTMLInputElement>('#input')!.value = 'test';

        element.renderRoot
          .querySelector('.back-button')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should remove "open" attribute from the host', () => {
        expect(element.hasAttribute('open')).toBe(false);
      });

      it('should clear input`s value', () => {
        const input = element.querySelector<HTMLInputElement>('#input');
        expect(input?.value).toBe('');
      });

      it('should dispatches close event', () => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
