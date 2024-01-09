import { fixture } from '@open-wc/testing-helpers';
import { EntityService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ImageComponent } from '@spryker-oryx/ui/image';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { ContentAsset } from '../src/models';
import { DataImageComponent } from './data-image.component';
import { dataImage } from './data-image.def';

class MockEntityService implements Partial<EntityService> {
  getField = vi.fn().mockReturnValue(of());
}

describe('DataImageComponent', () => {
  let element: DataImageComponent;
  let entityService: MockEntityService;

  beforeAll(async () => {
    await useComponent(dataImage);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [{ provide: EntityService, useClass: MockEntityService }],
    });
    entityService = injector.inject<MockEntityService>(EntityService);
  });

  afterEach(() => destroyInjector());

  describe('when an field option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-data-image
          .options=${{ entity: 'data', field: 'name' }}
        ></oryx-data-image>`
      );
    });

    it('should call the entity service to resolve the data', () => {
      expect(entityService.getField).toHaveBeenCalledWith({
        element: element,
        type: 'data',
        field: 'name',
      });
    });

    describe('and an image url is returned', () => {
      beforeEach(async () => {
        entityService.getField.mockReturnValue(of('https://myimage.com'));
        element = await fixture(
          html`<oryx-data-image
            .options=${{ entity: 'data', field: 'name' }}
          ></oryx-data-image>`
        );
      });

      it('should render the image', () => {
        const image =
          element.shadowRoot?.querySelector<ImageComponent>('oryx-image');
        expect(image?.src).toEqual('https://myimage.com');
      });
    });

    describe('and an image object is returned', () => {
      beforeEach(async () => {
        entityService.getField.mockReturnValue(
          of({ src: 'https://myimage.com', alt: 'alt text' } as ContentAsset)
        );
        element = await fixture(
          html`<oryx-data-image
            .options=${{ entity: 'data', field: 'name' }}
          ></oryx-data-image>`
        );
      });

      it('should render the image and alt text', () => {
        const image =
          element.shadowRoot?.querySelector<ImageComponent>('oryx-image');
        expect(image?.src).toEqual('https://myimage.com');
        expect(image?.alt).toEqual('alt text');
      });
    });

    describe('and no image is returned', () => {
      beforeEach(async () => {
        entityService.getField.mockReturnValue(of(null));
      });

      describe('and a renderFallback option is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-data-image
              .options=${{
                entity: 'data',
                field: 'name',
                renderFallback: true,
              }}
            ></oryx-data-image>`
          );
        });

        it('should render the image', () => {
          expect(element).toContainElement('oryx-image');
        });
      });

      describe('and a renderFallback option is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-data-image
              .options=${{
                entity: 'data',
                field: 'name',
              }}
            ></oryx-data-image>`
          );
        });

        it('should not render the image', () => {
          expect(element).not.toContainElement('oryx-image');
        });
      });
    });
  });
});
