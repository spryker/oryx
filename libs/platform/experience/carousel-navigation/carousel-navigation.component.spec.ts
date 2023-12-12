import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LayoutComponent } from '../layout';
import { CarouselLayoutProperties } from '../src/services';
import { CarouselNavigationComponent } from './carousel-navigation.component';
import { carouselNavigationComponent } from './carousel-navigation.def';

class MockIntersectionObserver implements IntersectionObserver {
  constructor(public callback: any, options?: IntersectionObserverInit) {}

  root: Document | Element | null = null;
  rootMargin = ``;
  thresholds: readonly number[] = [];

  disconnect = vi.fn();
  observe = () => this.callback(['']);
  takeRecords = vi.fn();
  unobserve = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver;

(window as any).getComputedStyle = () => ({
  getPropertyValue: () => '0px',
});

@customElement('mock-layout')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockLayout extends LitElement {
  @property({ type: Object }) options?: CarouselLayoutProperties;

  protected override render(): TemplateResult {
    return html` <oryx-carousel-navigation
        ?showArrows=${this.options?.showArrows}
        ?showIndicators=${this.options?.showIndicators}
        ?vertical=${this.options?.vertical}
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
        ${[...Array(12).keys()].map(
          (key) => html`<div width="200">${key}</div>`
        )}
      </mock-layout>`
    );
    nav = element.renderRoot.querySelector('oryx-carousel-navigation');
  };

  beforeAll(async () => {
    mockFeatureVersion('1.2');
    await useComponent([carouselNavigationComponent]);
  });

  afterEach(() => {
    destroyInjector();
  });

  const itemCount = 12;

  const mockTests = [
    { vertical: false, mocks: ['clientWidth', 'scrollWidth'] },
    { vertical: true, mocks: ['clientHeight', 'scrollHeight'] },
  ] as const;

  mockTests.forEach(({ vertical, mocks }) => {
    describe(`when vertical is ${vertical}`, () => {
      beforeEach(async () => {
        vi.spyOn(HTMLElement.prototype, mocks[0], 'get').mockReturnValue(800);
        vi.spyOn(HTMLElement.prototype, mocks[1], 'get').mockReturnValue(
          itemCount * 200
        );
      });

      describe('and showArrow is true', () => {
        beforeEach(async () => {
          await layout({ vertical, showArrows: true });
        });

        it('should render the arrows', () => {
          expect(nav).toContainElement('oryx-button.previous');
          expect(nav).toContainElement('oryx-button.next');
        });
      });

      describe('and showArrow is false', () => {
        beforeEach(async () => {
          await layout({ vertical, showArrows: false });
        });

        it('should not render the arrows', () => {
          expect(nav).not.toContainElement('oryx-button.previous');
          expect(nav).not.toContainElement('oryx-button.next');
        });
      });

      describe('and showIndicators is true', () => {
        beforeEach(async () => {
          await layout({ vertical, showIndicators: true });
        });

        it(`should render ${itemCount / 4} indicators`, () => {
          expect(nav).toContainElement(
            `.indicators input:nth-child(${itemCount / 4})`
          );
        });

        it(`should have active first indicator`, () => {
          const firstIndicator = nav?.shadowRoot?.querySelector(
            '.indicators input:nth-child(1)'
          ) as HTMLInputElement & {
            style: { getPropertyValue: (property: string) => string };
          };

          expect(firstIndicator.style.getPropertyValue('--opacity')).toBe('1');
        });

        it(`should change indicators length depends on clientWidth`, async () => {
          vi.spyOn(HTMLElement.prototype, mocks[0], 'get').mockReturnValue(400);
          element.dispatchEvent(new Event('resize'));
          await nextFrame();
          await nextFrame();
          expect(nav).toContainElement(
            `.indicators input:nth-child(${itemCount / 2})`
          );
        });

        it(`should not show indicators when clientWidth more then slides width`, async () => {
          vi.spyOn(HTMLElement.prototype, mocks[0], 'get').mockReturnValue(
            itemCount * 300
          );
          element.dispatchEvent(new Event('resize'));
          await nextFrame();
          await nextFrame();
          expect(nav).not.toContainElement(`.indicators input`);
        });
      });

      describe('and showIndicators is false', () => {
        beforeEach(async () => {
          await layout({ vertical, showIndicators: false });
        });

        it(`should not render indicators`, () => {
          expect(nav).not.toContainElement(`.indicators`);
        });
      });
    });
  });
});
