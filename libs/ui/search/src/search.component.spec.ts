import { expect, fixture, html } from '@open-wc/testing';
import { SearchEvent, SearchIconPosition } from './';
import './index';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let element: SearchComponent;

  describe('when the <oryx-search> is created', () => {
    it('is should be an instance of SearchComponent', () => {
      const el = document.createElement('oryx-search');
      expect(el).to.be.instanceof(SearchComponent);
    });
  });

  describe('searchIconPosition', () => {
    describe('when the searchIconPosition is not given', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search></oryx-search>`);
      });
      it('should render the search button in the prefix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=prefix] button oryx-icon'
          )
        ).to.exist;
      });
      it('should not render the search button in the suffix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=suffix] button oryx-icon'
          )
        ).to.not.exist;
      });

      describe('and a searchIcon is given', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-search searchIcon="custom-search"></oryx-search>`
          );
        });
        it('should render the custom search icon', () => {
          expect(
            element.shadowRoot?.querySelector(
              'slot[name=prefix] button oryx-icon'
            )
          ).to.exist;
        });
      });
    });

    describe('when the searchIconPosition is SearchIconPosition.START', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search
            .searchIconPosition=${SearchIconPosition.START}
          ></oryx-search>`
        );
      });
      it('should render the search button in the prefix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=prefix] button oryx-icon'
          )
        ).to.exist;
      });
      it('should not render the search button in the suffix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=suffix] button oryx-icon'
          )
        ).to.not.exist;
      });
    });

    describe('when the searchIconPosition is SearchIconPosition.END', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search
            .options=${{ searchIconPosition: SearchIconPosition.END }}
          ></oryx-search>`
        );
      });

      it('should not render the search button in the prefix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=prefix] button oryx-icon'
          )
        ).to.not.exist;
      });

      it('should render the search button in the suffix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=suffix] button oryx-icon'
          )
        ).to.exist;
      });
    });

    describe('when the searchIconPosition is SearchIconPosition.NONE', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search
            .options=${{ searchIconPosition: SearchIconPosition.NONE }}
          ></oryx-search>`
        );
      });

      it('should not render the search button in the prefix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=prefix] button oryx-icon'
          )
        ).to.not.exist;
      });

      it('should not render the search button in the suffix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=suffix] button oryx-icon'
          )
        ).to.not.exist;
      });
    });
  });

  describe('prefix', () => {
    describe('when no prefixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search></oryx-search>`);
      });

      it('should render the search icon', () => {
        expect(element.shadowRoot?.querySelector('slot[name=prefix] oryx-icon'))
          .to.exist;
      });
    });

    describe('when a prefixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search prefixIcon="custom"></oryx-search>`
        );
      });

      it('should render the icon', () => {
        expect(element.shadowRoot?.querySelector('oryx-icon')).to.exist;
      });
    });
  });

  describe('suffix', () => {
    describe('when no clearIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search></oryx-search>`);
      });

      it('should render the clear icon', () => {
        expect(element.shadowRoot?.querySelector('.clear oryx-icon svg')).to
          .exist;
      });
    });

    describe('when a clearIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search clearIcon="clear"></oryx-search>`
        );
      });

      it('should render the clear icon', () => {
        expect(element.shadowRoot?.querySelector('.clear oryx-icon')).to.exist;
      });
    });
  });

  describe('search', () => {
    const searchButton = (): HTMLButtonElement | null | undefined =>
      element.shadowRoot?.querySelector('button.search');

    const itShouldDispatchSearchEvent = (value: string): void => {
      it(`should dispatch search event (${value})`, (done) => {
        element.addEventListener('oryx.search', ((
          ev: CustomEvent<SearchEvent>
        ) => {
          expect(ev.detail?.query).to.eq(value);
          done();
        }) as EventListener);
        searchButton()?.click();
      });
    };

    describe('when no custom input control is given', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search></oryx-search>`);
      });

      describe('and the search button is clicked', () => {
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

      describe('and the search button is clicked', () => {
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
    const clearButton = (): HTMLButtonElement | null | undefined =>
      element.shadowRoot?.querySelector('button.clear');

    describe('when the input is empty', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search></oryx-search>`);
      });

      it('should hide the clear button', () => {
        expect(element.classList.contains('has-value')).to.be.false;
      });
    });

    describe('when the input has an initial value', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-search>
          <input value="value123" />
        </oryx-search>`);
      });

      it('should show the clear button after 50ms', (done) => {
        setTimeout(() => {
          expect(element.classList.contains('has-value')).to.be.true;
          done();
        }, 50);
      });

      describe('but when clear button is clicked', () => {
        it('should hide the clear button', () => {
          clearButton()?.click();
          expect(element.classList.contains('has-value')).to.be.false;
        });
      });
    });
  });
});
