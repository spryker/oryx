import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ProductImagesComponent } from './images.component';
import { productImagesComponent } from './images.def';
import {
  ProductImagesMainLayout,
  ProductImagesNavigationAlignment,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout,
  ProductImagesNavigationMouseEvent,
  ProductImagesNavigationPosition,
} from './images.model';

// eslint-disable-next-line @typescript-eslint/no-empty-function
Element.prototype.scroll = (): void => {};

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = ({ uid = '' }): Observable<any> => of({});
}

describe('ProductImagesComponent', () => {
  let element: ProductImagesComponent;

  beforeAll(async () => {
    await useComponent(productImagesComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: ExperienceService,
          useClass: MockExperienceContentService,
        },
      ],
    });
    element = await fixture(html`<product-images sku="1"></product-images>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ProductImagesComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when the product has 3 images', () => {
    it('should render a product-media for each main image', () => {
      const media = element?.shadowRoot?.querySelectorAll(
        'section product-media'
      );
      expect(media?.length).toBe(3);
    });

    it('should render a product-media for each thumbnail', () => {
      const media = element?.shadowRoot?.querySelectorAll('.nav product-media');
      expect(media?.length).toBe(3);
    });

    it('should make the first main image active', () => {
      const media = element?.shadowRoot?.querySelectorAll(
        'section product-media'
      );
      expect(media?.[0].hasAttribute('active')).toBe(true);
    });

    describe('and when an input event is dispatched on the next image', () => {
      beforeEach(() => {
        const thumbs = element?.shadowRoot?.querySelectorAll('.nav input');
        thumbs?.[1].dispatchEvent(
          new InputEvent('input', { bubbles: true, composed: true })
        );
      });

      it('should make the next main image active', () => {
        const mainImages = element?.shadowRoot?.querySelectorAll(
          'section product-media'
        );
        expect(mainImages?.[1]?.hasAttribute('active')).toBe(true);
      });
    });
  });

  describe('options', () => {
    describe('mainLayout', () => {
      describe('when mainLayout is not configured', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images sku="1"></product-images>`
          );
        });

        it('should not render main-layout attribute', () => {
          expect(element).toContainElement(`slot:not([main-layout])`);
        });
      });

      describe('when mainLayout is `carousel`', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images
              sku="1"
              .options=${{ mainLayout: ProductImagesMainLayout.Carousel }}
            ></product-images>`
          );
        });

        it('should render main-layout attribute', () => {
          expect(element).toContainElement(`slot[main-layout='carousel']`);
        });

        it('should render product-media element(s)', () => {
          expect(element).toContainElement('section product-media');
        });
      });

      describe('when mainLayout is `toggle`', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images
              sku="1"
              .options=${{ mainLayout: ProductImagesMainLayout.Toggle }}
            ></product-images>`
          );
        });

        it('should render main-layout attribute', () => {
          expect(element).toContainElement(`slot[main-layout='toggle']`);
        });

        it('should render product-media element(s)', () => {
          expect(element).toContainElement('section product-media');
        });
      });

      describe('when mainLayout is `none`', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images
              sku="1"
              .options=${{ mainLayout: ProductImagesMainLayout.None }}
            ></product-images>`
          );
        });

        it('should not render any product-media elements', () => {
          expect(element).not.toContainElement('section product-media');
        });
      });
    });

    describe('navigationPosition', () => {
      [
        ProductImagesNavigationPosition.Start,
        ProductImagesNavigationPosition.Bottom,
        ProductImagesNavigationPosition.End,
      ].forEach((pos) => {
        describe(`when the navigationPosition is '${pos}'`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<product-images
                sku="1"
                .options=${{
                  navigationPosition: pos,
                }}
              ></product-images>`
            );
          });

          it('should render nav-position attribute', () => {
            expect(element).toContainElement(`slot[nav-position='${pos}']`);
          });
        });
      });

      describe(`when the navigationPosition is not provided`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images sku="1"></product-images>`
          );
        });

        it('should not render nav-position attribute', () => {
          expect(element).toContainElement(`slot:not([nav-position])`);
        });
      });
    });

    describe('navigationLayout', () => {
      [
        ProductImagesNavigationLayout.Carousel,
        ProductImagesNavigationLayout.Grid,
      ].forEach((navigationLayout) => {
        describe(`when the navigationLayout is '${navigationLayout}'`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<product-images
                sku="1"
                .options=${{
                  navigationLayout,
                }}
              ></product-images>`
            );
          });

          it('should render nav-layout attribute', () => {
            expect(element).toContainElement(
              `slot[nav-layout='${navigationLayout}']`
            );
          });
        });

        describe(`when the navigationLayout is not provided`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<product-images sku="1"></product-images>`
            );
          });

          it('should not render nav-layout attribute', () => {
            expect(element).toContainElement(`slot:not([nav-layout])`);
          });
        });
      });
    });

    describe('navigationDisplay', () => {
      describe(`when the navigationDisplay is not provided`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images sku="1"></product-images>`
          );
        });

        it('should not render nav-display attribute', () => {
          expect(element).toContainElement(`slot:not([nav-display])`);
        });
      });

      [
        ProductImagesNavigationDisplay.Inline,
        ProductImagesNavigationDisplay.Floating,
      ].forEach((display) => {
        describe(`when navigationDisplay is ${display}`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<product-images
                sku="1"
                .options=${{ navigationDisplay: display }}
              ></product-images>`
            );
          });

          it(`should render a nav-display attribute`, () => {
            expect(element).toContainElement(`slot[nav-display='${display}']`);
          });

          it(`should render the navigation`, () => {
            expect(element).toContainElement(`.nav`);
          });

          describe('and when there are no images', () => {
            beforeEach(async () => {
              element = await fixture(
                html`<product-images
                  sku="without-images"
                  .options=${{ navigationDisplay: display }}
                ></product-images>`
              );
            });

            it('should not render the navigation', () => {
              expect(element).not.toContainElement('.nav');
            });
          });

          describe('and when there is only 1 image', () => {
            beforeEach(async () => {
              element = await fixture(
                html`<product-images
                  sku="single-image"
                  .options=${{ navigationDisplay: display }}
                ></product-images>`
              );
            });

            it('should not render the navigation', () => {
              expect(element).not.toContainElement('.nav');
            });
          });
        });
      });

      describe(`when navigationDisplay is set to none`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images
              sku="1"
              .options=${{
                navigationDisplay: ProductImagesNavigationDisplay.None,
              }}
            ></product-images>`
          );
        });

        it(`should render a nav-display attribute`, () => {
          expect(element).toContainElement(`slot[nav-display='none']`);
        });

        it(`should not render the navigation`, () => {
          expect(element).not.toContainElement(`.nav`);
        });
      });
    });

    describe('navigationAlignment', () => {
      [
        ProductImagesNavigationAlignment.Start,
        ProductImagesNavigationAlignment.Center,
        ProductImagesNavigationAlignment.End,
      ].forEach((navigationAlignment) => {
        describe(`when the navigationAlignment is '${navigationAlignment}'`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<product-images
                sku="1"
                .options=${{ navigationAlignment }}
              ></product-images>`
            );
          });

          it(`should render a nav-align attribute`, () => {
            expect(element).toContainElement(
              `slot[nav-align='${navigationAlignment}']`
            );
          });
        });
      });
      describe(`when the navigationAlignment is not provided`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images sku="1"></product-images>`
          );
        });

        it(`should not render a nav-align attribute`, () => {
          expect(element).toContainElement(`slot:not([nav-align])`);
        });
      });
    });

    describe('navigationMouseEvent', () => {
      let onInput: SpyInstance;

      beforeEach(() => {
        onInput = vi.fn();
      });

      describe('when the navigationMouseEvent is set to click', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images
              @input=${onInput}
              sku="1"
              .options=${{
                navigationMouseEvent: ProductImagesNavigationMouseEvent.Click,
              }}
            ></product-images>`
          );
        });

        describe('and the mouseover event is dispatched on the thumbnail', () => {
          beforeEach(async () => {
            const thumbs = element?.shadowRoot?.querySelectorAll('.nav input');
            thumbs?.[0].dispatchEvent(
              new MouseEvent('mouseover', { bubbles: true, composed: true })
            );
          });

          it('should not dispatch an input event', () => {
            expect(onInput).not.toHaveBeenCalled();
          });
        });
      });

      describe('when the navigationMouseEvent is set to hover', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<product-images
              @input=${onInput}
              .options=${{
                navigationMouseEvent:
                  ProductImagesNavigationMouseEvent.Mouseover,
              }}
              sku="1"
            ></product-images>`
          );
        });

        describe('and the mouseover event is dispatched on the thumbnail', () => {
          beforeEach(async () => {
            const thumbs = element?.shadowRoot?.querySelectorAll('.nav input');
            thumbs?.[0].dispatchEvent(
              new MouseEvent('mouseover', { bubbles: true, composed: true })
            );
          });

          it('should dispatch an input event', () => {
            expect(onInput).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
