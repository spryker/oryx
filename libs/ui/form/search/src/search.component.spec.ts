import { fixture, html } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchEvent,
  SearchIconPosition,
} from '.';
import { a11yConfig } from '../../../a11y';
import { queryFirstAssigned } from '../../../utilities';
import './index';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let element: SearchComponent;

  describe('search', () => {
    describe('searchIcon', () => {
      describe('when no searchIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the default search icon', () => {
          expect(
            getShadowElementBySelector(element, 'oryx-icon.search[type=search]')
          ).not.toBeNull();
        });
      });

      describe('when a searchIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              label="some label"
              searchIcon="custom-search-icon"
              }}
            ></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the custom search icon', () => {
          expect(
            getShadowElementBySelector(
              element,
              'oryx-icon.search[type=custom-search-icon]'
            )
          ).not.toBeNull();
        });
      });
    });

    describe('searchIconPosition', () => {
      const searchIcon = (slot: string): Element | undefined => {
        return queryFirstAssigned(element, {
          slot,
          selector: '.search',
          flatten: true,
        });
      };
      describe('when the position is undefined', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"></oryx-search>`
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

      describe('when the searchIconPosition is PREFIX', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .searchIconPosition=${SearchIconPosition.PREFIX}
              label="some label"
            ></oryx-search>`
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
                ><div slot="prefix">custom prefix content</div></oryx-search
              >`
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

      describe('when the searchIconPosition is SUFFIX', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .searchIconPosition=${SearchIconPosition.SUFFIX}
              label="some label"
            ></oryx-search>`
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
                ><div slot="suffix">custom prefix content</div></oryx-search
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

      describe('when the searchIconPosition is NONE', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .searchIconPosition=${SearchIconPosition.NONE}
              label="some label"
            ></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(
            getShadowElementBySelector(
              element,
              'slot[name=prefix] .search oryx-icon'
            )
          ).toBeNull();
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(
            getShadowElementBySelector(
              element,
              'slot[name=suffix] .search oryx-icon'
            )
          ).toBeNull();
        });
      });
    });

    const searchIcon = (): HTMLElement | null | undefined =>
      getShadowElementBySelector(element, '.search');

    const itShouldDispatchSearchEvent = (value: string): void => {
      it(`should dispatch search event (${value})`, (done) => {
        const emitter = ((ev: CustomEvent<SearchEvent>) => {
          expect(ev.detail?.query).toBe(value);
          done();
        }) as EventListener;
        element.addEventListener('oryx.search', emitter);
        searchIcon()?.click();
        element.removeEventListener('oryx.search', emitter);
      });
    };

    describe('when no custom input control is given', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search></oryx-search>`);
      });

      describe('and the search icon is clicked', () => {
        itShouldDispatchSearchEvent('');
      });

      describe('and the enter key is used', () => {
        it('should trigger the oryx.search event', (done) => {
          const emitter = ((ev: CustomEvent<SearchEvent>) => {
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
        });
      });

      describe('and when the value is changed ', () => {
        beforeEach(async () => {
          const input = getShadowElementBySelector(
            element,
            'input'
          ) as HTMLInputElement;
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
        it('should trigger the oryx.search event', (done) => {
          const emitter = ((ev: CustomEvent<SearchEvent>) => {
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
        });
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
            html`<oryx-search label="some label"></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the default clear icon', () => {
          expect(
            getShadowElementBySelector(element, 'oryx-icon.clear[type=remove]')
          ).not.toBeNull();
        });
      });

      describe('when a clearIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              clearIcon="custom-clear-icon"
              label="some label"
              }}
            ></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the custom clear icon', () => {
          expect(
            getShadowElementBySelector(
              element,
              'oryx-icon.clear[type=custom-clear-icon]'
            )
          ).not.toBeNull();
        });
      });
    });

    describe('clearIconPosition', () => {
      const clearIcon = (slot: string): Element | undefined => {
        return queryFirstAssigned(element, {
          slot,
          selector: '.clear',
          flatten: true,
        });
      };
      describe('when the position is undefined', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search label="some label"></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the clear icon after the input control', () => {
          expect(
            getShadowElementBySelector(element, 'slot:not([name]) + .clear')
          ).not.toBeNull();
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(clearIcon('prefix')).toBeUndefined();
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(clearIcon('suffix')).toBeUndefined();
        });
      });

      describe('when the position is AFTER', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconPosition=${ClearIconPosition.AFTER}
              label="some label"
            ></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should render the clear icon after the input control', () => {
          expect(
            getShadowElementBySelector(element, 'slot:not([name]) + .clear')
          ).not.toBeNull();
        });

        it('should not render the clear icon in the prefix slot', () => {
          expect(clearIcon('prefix')).toBeUndefined();
        });

        it('should not render the clear icon in the suffix slot', () => {
          expect(clearIcon('suffix')).toBeUndefined();
        });
      });

      describe('when the position is SUFFIX', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconPosition=${ClearIconPosition.SUFFIX}
              label="some label"
            ></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render the clear icon after the input control', () => {
          expect(
            getShadowElementBySelector(element, 'slot:not([name]) + .clear')
          ).toBeNull();
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(clearIcon('prefix')).toBeUndefined();
        });

        it('should render the search icon in the suffix slot', () => {
          expect(clearIcon('suffix')).not.toBeNull();
        });
      });

      describe('when the position is NONE', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconPosition=${ClearIconPosition.NONE}
              label="some label"
            ></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render the clear icon after the input control', () => {
          expect(
            getShadowElementBySelector(element, 'slot:not([name]) + .clear')
          ).toBeNull();
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
            html`<oryx-search label="some label"></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should use toggle', () => {
          expect(
            element.shadowRoot
              ?.querySelector('.clear')
              ?.getAttribute('appearance')
          ).toBe('TOGGLE');
        });
      });

      describe('when the appearance is given', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .clearIconAppearance=${ClearIconAppearance.HOVER}
              label="some label"
            ></oryx-search>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should add the appearance on the clear icon', () => {
          expect(
            element.shadowRoot
              ?.querySelector('.clear')
              ?.getAttribute('appearance')
          ).toBe('HOVER');
        });
      });
    });

    const clearIcon = (): HTMLElement | null | undefined =>
      getShadowElementBySelector(element, '.clear');

    describe('when the input is empty', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search label="some label"></oryx-search>`
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
});
