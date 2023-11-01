import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LayoutComponent } from '../layout';
import { layoutComponent } from '../layout/layout.def';
import { CarouselLayoutProperties } from '../src/services';
import { CarouselNavigationComponent } from './carousel-navigation.component';
import { carouselNavigationComponent } from './carousel-navigation.def';

class MockIntersectionObserver implements IntersectionObserver {
  root: Document | Element | null = null;
  rootMargin = ``;
  thresholds: readonly number[] = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver;

// Add the mock implementation for window.getComputedStyle
(window as any).getComputedStyle = (element: Element) => {
  return {
    getPropertyValue: (property: string) => {
      if (property === 'column-gap') {
        return '0px'; // Replace with the desired value for testing
      }
      // Add more property values as needed for your tests
      return '';
    },
  };
};

@customElement('mock-layout')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockLayout extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        width: 800px;
        overflow: auto;
      }
      div {
        width: 200px;
      }
    `,
  ];

  @property({ type: Object }) options?: CarouselLayoutProperties;

  protected override render(): TemplateResult {
    return html` <oryx-carousel-navigation
        ?showArrows=${this.options?.showArrows}
        ?showIndicators=${this.options?.showIndicators}
      ></oryx-carousel-navigation>
      <slot></slot>`;
  }
}

describe('CarouselNavigationComponent', () => {
  let element: LayoutComponent;
  let nav: CarouselNavigationComponent | null;

  const layout = async (options: CarouselLayoutProperties) => {
    element = await fixture(
      html`<mock-layout .options=${options}>
        ${[...Array(12).keys()].map((key) => html`<div>${key}</div>`)}
      </mock-layout>`
    );
    nav = element.renderRoot.querySelector('oryx-carousel-navigation');
  };

  beforeAll(async () => {
    mockFeatureVersion('1.2');
    await useComponent([layoutComponent, carouselNavigationComponent]);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        // {
        //   provide: LayoutService,
        //   useClass: MockLayoutService,
        // },
        // {
        //   provide: LayoutBuilder,
        //   useClass: MockLayoutBuilder,
        // },
        // {
        //   provide: CarouselLayoutPluginToken,
        //   useClass: CarouselLayoutPlugin,
        // },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when showArrow is true', () => {
    beforeEach(async () => {
      await layout({ showArrows: true });
    });

    it('should render the arrows', () => {
      expect(nav).toContainElement('oryx-button.previous');
      expect(nav).toContainElement('oryx-button.next');
    });
  });

  describe('when showArrow is false', () => {
    beforeEach(async () => {
      await layout({ showArrows: false });
    });

    it('should not render the arrows', () => {
      expect(nav).not.toContainElement('oryx-button.previous');
      expect(nav).not.toContainElement('oryx-button.next');
    });
  });

  describe('when showIndicators is true', () => {
    beforeEach(async () => {
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
        800
      );
      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
        2400
      );

      await layout({ showIndicators: true });
    });

    it('should render the indicators', () => {
      expect(nav).toContainElement('.indicators');
      expect(nav).toContainElement('.indicators input');
    });
  });
});
