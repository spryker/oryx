import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { PaginationComponent } from './pagination.component';
import { paginationComponent } from './pagination.def';

describe('PaginationComponent', () => {
  let element: PaginationComponent;

  beforeAll(async () => {
    await useComponent(paginationComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-pagination');
    expect(el).toBeInstanceOf(PaginationComponent);
  });

  describe('pagination initial state', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-pagination><a>1</a></oryx-pagination>`
      );
    });

    it('should contain pagination link by initial state', () => {
      const activeLink = element.querySelector('a[active]');
      expect(activeLink).not.toBeNull();
      expect(activeLink?.textContent).toContain(element.current);
    });
  });

  describe('pagination pages should display only max links', () => {
    const size = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sizeParam = `&size=${size.length}`;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-pagination max=${size.length}>
          ${size.map((page) => {
            return html`<a href="/page=${page}${sizeParam}">${page}</a>`;
          })}
        </oryx-pagination>`
      );
    });

    size.forEach((page) => {
      it(`should display page ${page} link`, () => {
        const lastLink = element.querySelector(
          `a[href="/page=${page}${sizeParam}"]`
        );
        expect(lastLink).not.toBeNull();
        expect(lastLink?.textContent).toContain(page);
      });
    });
  });

  describe('display only max links', () => {
    const size = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-pagination max="5">
          ${size.map((page) => {
            return html`<a>${page}</a>`;
          })}
        </oryx-pagination>`
      );
    });

    size.forEach((page) => {
      it(`should active link ${page} page and maximum pagination elements 7`, async () => {
        element.current = page;
        await element.updateComplete;
        await elementUpdated(element);
        const activeLink = element.querySelector('a[active]');
        expect(activeLink).not.toBeNull();
        expect(activeLink?.textContent).toContain(page);
        /* We use "if" because in the state when we should
         * truncate pagination only from one side we should display
         * an element instead of a second truncated icon
         */
        if (
          element.current >= element.max &&
          element.current <= size.length - element.max + 1
        ) {
          expect(element.querySelectorAll('a[visible]').length).toBe(
            element.max + 2
          );
        } else {
          expect(element.querySelectorAll('a[visible]').length).toBe(
            element.max + 1
          );
        }
      });
    });
  });

  describe('isEmpty', () => {
    describe('when there are no pages', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-pagination></oryx-pagination>`);
      });

      it('should not show pagination component', () => {
        expect(element.isEmpty).toBe(true);
      });
    });

    describe('when there is only 1 page', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-pagination><a>1</a></oryx-pagination>`
        );
      });

      it('should not show pagination component', () => {
        expect(element.isEmpty).toBe(true);
      });
    });

    describe('when there is more then 1 page', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-pagination>
            <a>1</a>
            <a>2</a>
          </oryx-pagination>`
        );
      });

      it('should show the pagination component', () => {
        expect(element.isEmpty).toBe(false);
      });
    });
  });

  describe('when navigation is enabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-pagination enableNavigation></oryx-pagination>`
      );
    });

    it('should render navigation buttons', () => {
      expect(element).toContainElement('slot[name="previous"]');
      expect(element).toContainElement('slot[name="next"]');
    });

    [null, { ctrlKey: true }, { metaKey: true }].forEach((modifier) => {
      describe(`and nav buttons are clicked${
        modifier ? `with modifier ${JSON.stringify(modifier)}` : ''
      }`, () => {
        it(`should ${modifier ? 'not ' : ''}prevent events behavior`, () => {
          element.renderRoot
            .querySelectorAll('slot[name="next"],slot[name="previous"]')
            .forEach((el) => {
              const event = new MouseEvent('click', modifier || {});
              const spy = vi.spyOn(event, 'preventDefault');
              el.dispatchEvent(event);

              expect(spy).not.toHaveBeenCalled();
            });
        });
      });
    });
  });
});
