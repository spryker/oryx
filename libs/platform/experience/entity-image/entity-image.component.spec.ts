import { fixture } from '@open-wc/testing-helpers';
import {
  ContextService,
  DefaultEntityService,
  EntityService,
  provideEntity,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { EntityImageComponent } from './entity-image.component';
import { entityImage } from './entity-image.def';

class MockDataService {
  // get = () => of({ image: 'https://myimage.com' });
  get = vi.fn();
}

describe('EntityTextComponent', () => {
  let element: EntityImageComponent;
  let mockService: MockDataService;

  beforeAll(async () => {
    await useComponent(entityImage);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        { provide: EntityService, useClass: DefaultEntityService },
        {
          provide: ContextService,
          useValue: {
            get: () => of({ sku: '1' }),
          },
        },
        { provide: 'MockDataService', useClass: MockDataService },
        provideEntity('data', {
          service: 'MockDataService',
          context: 'sku',
        }),
      ],
    });
    mockService = injector.inject('MockDataService');
  });

  afterEach(() => destroyInjector());

  describe('when an image is available for the type and field', () => {
    beforeEach(async () => {
      mockService.get.mockReturnValue(of({ image: 'https://myimage.com' }));
      element = await fixture(
        html`<oryx-entity-image
          .options=${{ entity: 'data', field: 'image' }}
        ></oryx-entity-image>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render an image', () => {
      expect(element).toContainElement('oryx-image');
    });
  });

  describe('when an image is not available for the type and field', () => {
    beforeEach(async () => {
      mockService.get.mockReturnValue(of());
      element = await fixture(
        html`<oryx-entity-image
          .options=${{ entity: 'data', field: 'image' }}
        ></oryx-entity-image>`
      );
    });

    it('should not render an image', () => {
      expect(element).not.toContainElement('oryx-image');
    });
  });
});
