import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { SearchFacetValueNavigationComponent } from './facet-value-navigation.component';
import { searchFacetValueNavigationComponent } from './facet-value-navigation.def';

const mockHeading = 'mockHeading';
const mockValuesLength = 5;
const mockSelectedLength = 3;

describe('SearchFacetValueNavigationComponent', () => {
  let element: SearchFacetValueNavigationComponent;

  beforeAll(async () => {
    await useComponent(searchFacetValueNavigationComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-search-facet-value-navigation
        open
      ></oryx-search-facet-value-navigation>`
    );
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SearchFacetValueNavigationComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should expand the collapsible', async () => {
    await expect(element).toContainElement('oryx-collapsible[open]');
  });

  describe('when heading is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-value-navigation
          .heading=${mockHeading}
          open
        ></oryx-search-facet-value-navigation>`
      );
    });

    it('should render heading in the slot', () => {
      const slot = element.renderRoot.querySelector(
        'slot[name="heading"]'
      ) as HTMLElement;

      expect(slot.innerText).toContain(mockHeading);
    });
  });

  describe('when toggling is enabled', () => {
    let button: HTMLElement | null;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-value-navigation
          enableToggle
          open
        ></oryx-search-facet-value-navigation>`
      );

      button = element.renderRoot.querySelector(
        'slot:not([name]) + oryx-button button'
      );
    });

    it('should render toggle button with "collapsed" title', () => {
      expect(button?.textContent).toContain('Show all');
    });

    describe('and valuesLength is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search-facet-value-navigation
            .valuesLength=${mockValuesLength}
            enableToggle
            open
          ></oryx-search-facet-value-navigation>`
        );

        button = element.renderRoot.querySelector(
          'slot:not([name]) + oryx-button button'
        );
      });

      it('should render toggle button with amount of values', () => {
        expect(button?.textContent).toContain(`Show all (${mockValuesLength})`);
      });
    });

    describe('and toggle button is clicked', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search-facet-value-navigation
            .valuesLength=${mockValuesLength}
            enableToggle
            open
            @oryx.toggle=${callback}
          ></oryx-search-facet-value-navigation>`
        );

        button = element.renderRoot.querySelector(
          'slot:not([name]) + oryx-button button'
        );
        button?.dispatchEvent(new MouseEvent('click'));
      });

      it('should dispatch oryx.toggle event with correct value', () => {
        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              expanded: true,
            }),
          })
        );
      });

      it('should render toggle button with "expanded" title', () => {
        expect(button?.textContent).toContain('Show less');
      });
    });
  });

  describe('when selectedLength is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-value-navigation
          .selectedLength=${mockSelectedLength}
        ></oryx-search-facet-value-navigation>`
      );
    });

    it('should render chip with selected value', () => {
      const chip = element.renderRoot.querySelector('oryx-chip');
      expect(chip?.textContent).toContain(String(mockSelectedLength));
    });
  });

  describe('when clear is enabled without selectedLength', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-value-navigation
          enableClear
        ></oryx-search-facet-value-navigation>`
      );
    });

    it('should not render clear button', () => {
      expect(element).not.toContainElement('section oryx-button');
    });

    describe('and selectedLength is provided', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search-facet-value-navigation
            enableClear
            .selectedLength=${mockSelectedLength}
            @oryx.clear=${callback}
          ></oryx-search-facet-value-navigation>`
        );
      });

      it('should render clear button', () => {
        expect(element).toContainElement('section oryx-button');
      });

      describe('and clear button is clicked', () => {
        beforeEach(() => {
          element.renderRoot
            .querySelector('section oryx-button button')
            ?.dispatchEvent(new MouseEvent('click'));
        });

        it('should dispatch oryx.clear event', () => {
          expect(callback).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when search is enabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-search-facet-value-navigation
          enableSearch
          open
        ></oryx-search-facet-value-navigation>`
      );
    });

    it('should render search input with default placeholder', () => {
      expect(element).toContainElement(
        'oryx-search input[placeholder="Search"]'
      );
    });

    describe('and heading is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search-facet-value-navigation
            .heading=${mockHeading}
            enableSearch
            open
          ></oryx-search-facet-value-navigation>`
        );
      });

      it('should add heading to the input`s placeholder', () => {
        expect(element).toContainElement(
          `oryx-search input[placeholder="Search ${mockHeading.toLowerCase()}"]`
        );
      });
    });
  });
});
