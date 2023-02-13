import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { SearchFacetValueNavigationComponent } from './facet-value-navigation.component';
import { searchFacetValueNavigationComponent } from './facet-value-navigation.def';
import {
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
} from './facet-value-navigation.model';

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
        .heading=${mockHeading}
        .valuesLength=${mockValuesLength}
        .selectedLength=${mockSelectedLength}
        ?enableClearAction=${true}
        ?enableToggle=${true}
        ?enableSearch=${true}
        ?open=${true}
      ></oryx-search-facet-value-navigation>`
    );
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SearchFacetValueNavigationComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should use collapsible', () => {
    expect(element.renderRoot.querySelector('oryx-collapsible')).not.toBe(null);
  });

  describe('attributes', () => {
    describe('heading', () => {
      it('should render as a part of collapsible heading', () => {
        const titleSlot = element.renderRoot.querySelector(
          '*[name="title"]'
        ) as HTMLElement;

        expect(titleSlot.innerText).toContain(mockHeading);
      });
    });

    describe('valuesLength', () => {
      it('should render as a part of show/hide button', () => {
        const button = element.renderRoot.querySelector(
          '.controls button'
        ) as HTMLElement;

        expect(button.innerText).toContain(mockValuesLength);
      });
    });

    describe('selectedLength', () => {
      it('should render as a part of collapsible heading', () => {
        const titleSlot = element.renderRoot.querySelector(
          '*[name="title"]'
        ) as HTMLElement;

        expect(titleSlot.innerText).toContain(mockSelectedLength);
      });
    });

    describe('enableToggle', () => {
      it('should render show/hide button', () => {
        expect(element).toContainElement('.controls button');
      });
    });

    describe('enableSearch', () => {
      it('should render input field for facet values search', () => {
        expect(element).toContainElement('oryx-search');
      });
    });

    describe('open', () => {
      it('should provide to the oryx-collapsible', () => {
        const collapsible =
          element.renderRoot.querySelector('oryx-collapsible');

        expect(collapsible?.hasAttribute('open')).toBe(true);
      });
    });
  });

  describe('events', () => {
    const callback = vi.fn();

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe('when clear action is enabled', () => {
      it('should emit oryx.clear event on button click', () => {
        document.addEventListener(FACET_CLEAR_EVENT, callback);

        const button = element.renderRoot.querySelector(
          '.header button'
        ) as HTMLButtonElement;

        button.click();
        expect(callback).toHaveBeenCalled();
      });
    });

    describe('when clear action is disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-search-facet-value-navigation
            .heading=${mockHeading}
            .valuesLength=${mockValuesLength}
            .selectedLength=${mockSelectedLength}
            ?enableClearAction=${false}
            ?enableToggle=${true}
            ?enableSearch=${true}
            ?open=${true}
          ></oryx-search-facet-value-navigation>`
        );
      });

      it('сlear button should not exist', () => {
        const button = element.renderRoot.querySelector(
          '.header button'
        ) as HTMLButtonElement;

        expect(button).toBeNull();
      });
    });

    describe('toggle', () => {
      it('should emit oryx.toggle event on show/hide button click', () => {
        document.addEventListener(FACET_TOGGLE_EVENT, callback);

        const button = element.renderRoot.querySelector(
          '.controls button'
        ) as HTMLButtonElement;

        button.click();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0].detail).toStrictEqual({
          isShowed: true,
        });

        button.click();
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback.mock.calls[1][0].detail).toStrictEqual({
          isShowed: false,
        });
      });
    });
  });
});
