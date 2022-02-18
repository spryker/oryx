import { expect, fixture, html } from '@open-wc/testing';
import { queryFirstAssigned } from '../../utilities';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchEvent,
  SearchIconPosition,
} from './';
import './index';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let element: SearchComponent;

  describe('search', () => {
    describe('searchIcon', () => {
      describe('when no searchIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-search></oryx-search>`);
        });
        it('should render the default search icon', () => {
          expect(
            element.shadowRoot?.querySelector('oryx-icon.search[type=search')
          ).to.exist;
        });
      });

      describe('when a searchIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ searchIcon: 'custom-search-icon' }}
            ></oryx-search>`
          );
        });
        it('should render the custom search icon', () => {
          expect(
            element.shadowRoot?.querySelector(
              'oryx-icon.search[type=custom-search-icon]'
            )
          ).to.exist;
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
          element = await fixture(html`<oryx-search></oryx-search>`);
        });

        it('should render the search icon in the prefix slot', () => {
          expect(searchIcon('prefix')).to.exist;
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(searchIcon('suffix')).to.not.exist;
        });
      });

      describe('when the searchIconPosition is PREFIX', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ searchIconPosition: SearchIconPosition.PREFIX }}
            ></oryx-search>`
          );
        });

        it('should render the search icon in the prefix slot', () => {
          expect(searchIcon('prefix')).to.exist;
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(searchIcon('suffix')).to.not.exist;
        });

        describe('and custom prefix content is slotted in', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-search
                ><div slot="prefix">custom prefix content</div></oryx-search
              >`
            );
          });

          it('should not render the search icon in the prefix slot', () => {
            expect(searchIcon('prefix')).to.not.exist;
          });
        });
      });

      describe('when the searchIconPosition is SUFFIX', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ searchIconPosition: SearchIconPosition.SUFFIX }}
            ></oryx-search>`
          );
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(searchIcon('prefix')).to.not.exist;
        });

        it('should render the search icon in the suffix slot', () => {
          expect(searchIcon('suffix')).to.exist;
        });

        describe('and custom suffix content is slotted in', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-search
                ><div slot="suffix">custom prefix content</div></oryx-search
              >`
            );
          });
          it('should not render the search icon in the suffix slot', () => {
            expect(searchIcon('suffix')).to.not.exist;
          });
        });
      });

      describe('when the searchIconPosition is NONE', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ searchIconPosition: SearchIconPosition.NONE }}
            ></oryx-search>`
          );
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(
            element.shadowRoot?.querySelector(
              'slot[name=prefix] .search oryx-icon'
            )
          ).to.not.exist;
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(
            element.shadowRoot?.querySelector(
              'slot[name=suffix] .search oryx-icon'
            )
          ).to.not.exist;
        });
      });
    });

    const searchIcon = (): HTMLElement | null | undefined =>
      element.shadowRoot?.querySelector('.search');

    const itShouldDispatchSearchEvent = (value: string): void => {
      it(`should dispatch search event (${value})`, (done) => {
        element.addEventListener('oryx.search', ((
          ev: CustomEvent<SearchEvent>
        ) => {
          expect(ev.detail?.query).to.eq(value);
          done();
        }) as EventListener);
        searchIcon()?.click();
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
          element.addEventListener('oryx.search', ((
            ev: CustomEvent<SearchEvent>
          ) => {
            expect(ev.detail?.query).to.eq('');
            done();
          }) as EventListener);
          element.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'Enter',
            })
          );
        });
      });

      describe('and when the value is changed ', () => {
        beforeEach(async () => {
          const input = element.shadowRoot?.querySelector('input');
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

      describe('and the search icon is clicked', () => {
        itShouldDispatchSearchEvent('value123');
      });

      describe('and the enter key is used', () => {
        it('should trigger the oryx.search event', (done) => {
          element.addEventListener('oryx.search', ((
            ev: CustomEvent<SearchEvent>
          ) => {
            expect(ev.detail?.query).to.eq('value123');
            done();
          }) as EventListener);
          element.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'Enter',
            })
          );
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
          element = await fixture(html`<oryx-search></oryx-search>`);
        });

        it('should render the default clear icon', () => {
          expect(
            element.shadowRoot?.querySelector('oryx-icon.clear[type=remove]')
          ).to.exist;
        });
      });

      describe('when a clearIcon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ clearIcon: 'custom-clear-icon' }}
            ></oryx-search>`
          );
        });

        it('should render the custom clear icon', () => {
          expect(
            element.shadowRoot?.querySelector(
              'oryx-icon.clear[type=custom-clear-icon]'
            )
          ).to.exist;
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
          element = await fixture(html`<oryx-search></oryx-search>`);
        });

        it('should render the clear icon after the input control', () => {
          expect(element.shadowRoot?.querySelector('slot:not([name]) + .clear'))
            .to.exist;
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(clearIcon('prefix')).to.not.exist;
        });

        it('should not render the search icon in the suffix slot', () => {
          expect(clearIcon('suffix')).to.not.exist;
        });
      });

      describe('when the position is AFTER', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ clearIconPosition: ClearIconPosition.AFTER }}
            ></oryx-search>`
          );
        });

        it('should render the clear icon after the input control', () => {
          expect(element.shadowRoot?.querySelector('slot:not([name]) + .clear'))
            .to.exist;
        });

        it('should not render the clear icon in the prefix slot', () => {
          expect(clearIcon('prefix')).to.not.exist;
        });

        it('should not render the clear icon in the suffix slot', () => {
          expect(clearIcon('suffix')).to.not.exist;
        });
      });

      describe('when the position is SUFFIX', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ clearIconPosition: ClearIconPosition.SUFFIX }}
            ></oryx-search>`
          );
        });

        it('should not render the clear icon after the input control', () => {
          expect(element.shadowRoot?.querySelector('slot:not([name]) + .clear'))
            .to.not.exist;
        });

        it('should not render the search icon in the prefix slot', () => {
          expect(clearIcon('prefix')).to.not.exist;
        });

        it('should render the search icon in the suffix slot', () => {
          expect(clearIcon('suffix')).to.exist;
        });
      });

      describe('when the position is NONE', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ clearIconPosition: ClearIconPosition.NONE }}
            ></oryx-search>`
          );
        });

        it('should not render the clear icon after the input control', () => {
          expect(element.shadowRoot?.querySelector('slot:not([name]) + .clear'))
            .to.not.exist;
        });

        it('should not render the clear icon in the prefix slot', () => {
          expect(clearIcon('prefix')).to.not.exist;
        });

        it('should not render the clear icon in the suffix slot', () => {
          expect(clearIcon('suffix')).to.not.exist;
        });
      });
    });

    describe('clearIconAppearance', () => {
      describe('when the appearance is undefined', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-search></oryx-search>`);
        });

        it('should use toggle', () => {
          expect(
            element.shadowRoot
              ?.querySelector('.clear')
              ?.getAttribute('appearance')
          ).to.eq('TOGGLE');
        });
      });

      describe('when the appearance is given', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search
              .options=${{ clearIconAppearance: ClearIconAppearance.HOVER }}
            ></oryx-search>`
          );
        });

        it('should add the appearance on the clear icon', () => {
          expect(
            element.shadowRoot
              ?.querySelector('.clear')
              ?.getAttribute('appearance')
          ).to.eq('HOVER');
        });
      });
    });

    const clearIcon = (): HTMLElement | null | undefined =>
      element.shadowRoot?.querySelector('.clear');

    describe('when the input is empty', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search></oryx-search>`);
      });

      it('should hide the clear icon', () => {
        expect(element.hasAttribute('has-value')).to.be.false;
      });
    });

    describe('when the input has an initial value', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search>
          <input value="value123" />
        </oryx-search>`);
      });

      it('should have the clear icon', () => {
        expect(clearIcon()).to.exist;
      });

      describe('but when clear icon is clicked', () => {
        it('should not have the `has-value` attribute', () => {
          clearIcon()?.click();
          expect(element.hasAttribute('has-value')).to.be.false;
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
          expect(element.hasAttribute('has-value')).to.be.false;
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
          expect(element.hasAttribute('has-value')).to.be.true;
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
          expect(element.hasAttribute('has-value')).to.be.true;
        });
      });
    });
  });
});
