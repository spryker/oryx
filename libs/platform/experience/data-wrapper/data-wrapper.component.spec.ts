import { fixture } from '@open-wc/testing-helpers';
import { ContextService, EntityService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LinkService } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { DataWrapperComponent } from './data-wrapper.component';
import { dataWrapper } from './data-wrapper.def';

class MockEntityService implements Partial<EntityService> {
  getQualifier = vi.fn().mockReturnValue(of());
}

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of());
}

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of());
  serialize = vi.fn().mockReturnValue(of());
}

describe('DataWrapperComponent', () => {
  let element: DataWrapperComponent;
  let entityService: MockEntityService;
  let linkService: MockLinkService;

  beforeAll(async () => {
    await useComponent(dataWrapper);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: LinkService, useClass: MockLinkService },
        { provide: ContextService, useClass: MockContextService },
      ],
    });
    entityService = injector.inject<MockEntityService>(EntityService);
    linkService = injector.inject<MockLinkService>(LinkService);
  });

  afterEach(() => destroyInjector());

  describe('when no qualifier property is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-data-wrapper></oryx-data-wrapper>`);
    });

    it('should render a slot', () => {
      expect(element).toContainElement('slot');
      expect(element).not.toContainElement('oryx-link');
    });
  });

  describe('when a link option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-data-wrapper .options=${{ link: true }}></oryx-data-wrapper>`
      );
    });

    it('should render the slot inside a link component', () => {
      expect(element).toContainElement('oryx-link a slot');
    });

    describe('when a qualifier is returned', () => {
      beforeEach(async () => {
        entityService.getQualifier.mockReturnValue(of({ sku: '123' }));
        element = await fixture(
          html`<oryx-data-wrapper
            .options=${{ link: true }}
          ></oryx-data-wrapper>`
        );
      });

      it('should get the link from the linkService', () => {
        expect(linkService.get).toHaveBeenCalledWith({ sku: '123' });
      });
    });

    describe('when a qualifier is not returned', () => {
      beforeEach(async () => {
        entityService.getQualifier.mockReturnValue(of());
        element = await fixture(
          html`<oryx-data-wrapper
            .options=${{ link: true }}
          ></oryx-data-wrapper>`
        );
      });

      it('should get the link from the linkService', () => {
        expect(linkService.get).not.toHaveBeenCalled();
      });
    });
  });
});
