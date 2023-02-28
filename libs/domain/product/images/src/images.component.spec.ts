import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductImagesComponent } from './images.component';
import { productImagesComponent } from './images.def';
import {
  ProductImagesMainLayout,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout,
  ProductImagesNavigationMouseEvent,
  ProductImagesNavigationPosition,
  ProductImagesScrollBehavior,
} from './images.model';

// eslint-disable-next-line @typescript-eslint/no-empty-function
Element.prototype.scroll = (): void => {};

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = vi.fn().mockReturnValue(of({}));
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
    element = await fixture(
      html`<oryx-product-images sku="1"></oryx-product-images>`
    );
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
    it('should render a oryx-product-media for each main image', () => {
      const media = element?.shadowRoot?.querySelectorAll(
        '.main oryx-product-media'
      );
      expect(media?.length).toBe(3);
    });

    it('should render a oryx-product-media for each thumbnail', () => {
      const media = element?.shadowRoot?.querySelectorAll(
        '.navigation oryx-product-media'
      );
      expect(media?.length).toBe(3);
    });

    describe('and when an input event is dispatched on the next image', () => {
      beforeEach(() => {
        const thumbs =
          element?.shadowRoot?.querySelectorAll('.navigation input');
        thumbs?.[1].dispatchEvent(
          new InputEvent('input', { bubbles: true, composed: true })
        );
      });

      it('should make the next main image active', () => {
        const main = element?.shadowRoot?.querySelector('.main');
        const mainImages = main?.querySelectorAll('oryx-product-media');
        expect(main?.scrollLeft).toBe(
          (mainImages?.[1] as HTMLElement)?.offsetLeft
        );
      });
    });
  });

  describe('when no product', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-images></oryx-product-images>`
      );
    });

    it('should not render content', () => {
      expect(element).not.toContainElement('oryx-layout');
    });
  });

  describe('when amount of medias is less then 2', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-images sku="single-image"></oryx-product-images>`
      );
    });

    it('should not render navigation', () => {
      expect(element).not.toContainElement(`.navigation`);
    });
  });

  describe('options', () => {
    describe('when options is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{
              imageLayout: '',
              navigationLayout: '',
              navigationPosition: '',
              imageObjectFit: '',
              navigationObjectFit: '',
              imageHeight: '',
              navigationHeight: '',
              imageColumns: '',
            }}
          ></oryx-product-images>`
        );
      });

      it('should set up default options values', () => {
        expect(element).toContainElement(
          `oryx-layout[navigation="${ProductImagesNavigationPosition.Bottom}"]:not([floating])`
        );
      });

      it('should set up default values for css properties', () => {
        expect(
          element.renderRoot
            .querySelector<HTMLElement>('oryx-layout')
            ?.style.getPropertyValue('--product-image-height')
        ).toBe('300px');
      });

      it('should render main layout first', () => {
        expect(element).toContainElement('.main:first-child');
      });

      it('should set up default properties for main layout', () => {
        expect(element).toContainElement(
          `.main[layout="${ProductImagesMainLayout.Carousel}"]:not([behavior])`
        );
      });

      it('should set up default values for css properties of main layout', () => {
        const layout = element.renderRoot.querySelector<HTMLElement>('.main');
        expect(layout?.style.getPropertyValue('--image-fit')).toBe('contain');
        expect(layout?.style.getPropertyValue('--cols')).toBe('1');
      });

      it('should set up default properties for navigation layout', () => {
        expect(element).toContainElement(
          `.navigation[layout="${ProductImagesNavigationLayout.Carousel}"]:not([vertical])`
        );
      });

      it('should set up default values for css properties of navigation layout', () => {
        const layout =
          element.renderRoot.querySelector<HTMLElement>('.navigation');
        expect(layout?.style.getPropertyValue('--item-height')).toBe('80px');
        expect(layout?.style.getPropertyValue('--item-width')).toBe('80px');
        expect(layout?.style.getPropertyValue('--image-fit')).toBe('contain');
      });
    });

    describe('mediaSet', () => {
      describe('when mediaSet is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{ mediaSet: 'default' }}
            ></oryx-product-images>`
          );
        });

        it('should render medias', () => {
          expect(element).toContainElement('oryx-product-media');
        });
      });

      describe('when wrong mediaSet is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{ mediaSet: 'original' }}
            ></oryx-product-images>`
          );
        });

        it('should not render medias', () => {
          expect(element).not.toContainElement('oryx-product-media');
        });
      });
    });

    describe('when scrollBehavior is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{ scrollBehavior: ProductImagesScrollBehavior.Smooth }}
          ></oryx-product-images>`
        );
      });

      it('should set attribute on main layout', () => {
        expect(element).toContainElement(
          `.main[behavior=${ProductImagesScrollBehavior.Smooth}]`
        );
      });
    });

    describe('when imageLayout is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{ imageLayout: ProductImagesMainLayout.Grid }}
          ></oryx-product-images>`
        );
      });

      it('should set attribute on main layout', () => {
        expect(element).toContainElement(
          `.main[layout=${ProductImagesMainLayout.Grid}]`
        );
      });
    });

    describe('navigationPosition', () => {
      describe('when navigationPosition is equal start', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{
                navigationPosition: ProductImagesNavigationPosition.Start,
              }}
            ></oryx-product-images>`
          );
        });

        it('should set vertical attribute on navigation layout', () => {
          expect(element).toContainElement(`.navigation[vertical]`);
        });
      });

      describe('when navigationPosition is equal end', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{
                navigationPosition: ProductImagesNavigationPosition.End,
              }}
            ></oryx-product-images>`
          );
        });

        it('should set vertical attribute on navigation layout', () => {
          expect(element).toContainElement(`.navigation[vertical]`);
        });
      });
    });

    describe('navigationDisplay', () => {
      describe('when navigationDisplay is equal floating', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{
                navigationDisplay: ProductImagesNavigationDisplay.Floating,
              }}
            ></oryx-product-images>`
          );
        });

        it('should set floating attribute on base layout', () => {
          expect(element).toContainElement(`oryx-layout[floating]`);
        });
      });

      describe('when navigationDisplay is equal none', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{
                navigationDisplay: ProductImagesNavigationDisplay.None,
              }}
            ></oryx-product-images>`
          );
        });

        it('should not render navigation', () => {
          expect(element).not.toContainElement(`.navigation`);
        });
      });
    });

    describe('when navigationLayout is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{ navigationLayout: ProductImagesNavigationLayout.Grid }}
          ></oryx-product-images>`
        );
      });

      it('should set attribute on navigation layout', () => {
        expect(element).toContainElement(
          `.navigation[layout=${ProductImagesNavigationLayout.Grid}]`
        );
      });
    });

    describe('navigationMouseEvent', () => {
      describe('when the navigationMouseEvent is set to click', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{
                navigationMouseEvent: ProductImagesNavigationMouseEvent.Click,
              }}
            ></oryx-product-images>`
          );

          element.renderRoot
            .querySelector('label:nth-child(2) input')
            ?.dispatchEvent(
              new MouseEvent('mouseover', { bubbles: true, composed: true })
            );
        });

        it('should not change active media', () => {
          expect(
            element.renderRoot
              .querySelector('label:nth-child(2) oryx-product-media')
              ?.hasAttribute('active')
          ).toBe(false);
        });
      });

      describe('when the navigationMouseEvent is set to Mouseover', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{
                navigationMouseEvent:
                  ProductImagesNavigationMouseEvent.Mouseover,
              }}
            ></oryx-product-images>`
          );

          element.renderRoot
            .querySelector('label:nth-child(2) input')
            ?.dispatchEvent(
              new MouseEvent('mouseover', { bubbles: true, composed: true })
            );

          element.requestUpdate();
          await elementUpdated(element);
        });

        it('should set related media as active', () => {
          expect(
            element.renderRoot
              .querySelector('label:nth-child(2) oryx-product-media')
              ?.hasAttribute('active')
          ).toBe(true);
        });
      });
    });

    describe('when imageHeight is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{ imageHeight: '100px' }}
          ></oryx-product-images>`
        );
      });

      it('should set css property', () => {
        expect(
          element.renderRoot
            .querySelector<HTMLElement>('oryx-layout')
            ?.style.getPropertyValue('--product-image-height')
        ).toBe('100px');
      });
    });

    describe('when navigationHeight is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{ navigationHeight: '100px' }}
          ></oryx-product-images>`
        );
      });

      it('should set css property', () => {
        expect(
          element.renderRoot
            .querySelector<HTMLElement>('.navigation')
            ?.style.getPropertyValue('--item-height')
        ).toBe('100px');
      });

      describe('and navigationWidth is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-images
              sku="1"
              .options=${{ navigationHeight: '100px' }}
            ></oryx-product-images>`
          );
        });

        it('should set --item-width equal height', () => {
          const nav =
            element.renderRoot.querySelector<HTMLElement>('.navigation');
          expect(nav?.style.getPropertyValue('--item-width')).toBe(
            nav?.style.getPropertyValue('--item-height')
          );
        });
      });
    });

    describe('when navigationWidth is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{ navigationWidth: '100px' }}
          ></oryx-product-images>`
        );
      });

      it('should set css property', () => {
        expect(
          element.renderRoot
            .querySelector<HTMLElement>('.navigation')
            ?.style.getPropertyValue('--item-width')
        ).toBe('100px');
      });
    });

    describe('when imagesColumns is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-images
            sku="1"
            .options=${{ imagesColumns: 2 }}
          ></oryx-product-images>`
        );
      });

      it('should set css property', () => {
        expect(
          element.renderRoot
            .querySelector<HTMLElement>('.main')
            ?.style.getPropertyValue('--cols')
        ).toBe('2');
      });
    });
  });
});
