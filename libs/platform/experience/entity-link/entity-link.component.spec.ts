import { fixture } from '@open-wc/testing-helpers';
import { ContextService, EntityService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LinkService } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { EntityLinkComponent } from './entity-link.component';
import { entityLink } from './entity-link.def';

class MockEntityService implements Partial<EntityService> {
  getField = vi.fn().mockReturnValue(of());
}

describe('EntityLinkComponent', () => {
  let element: EntityLinkComponent;
  let entityService: MockEntityService;

  beforeAll(async () => {
    await useComponent(entityLink);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: ContextService, useValue: {} },
        { provide: LinkService, useValue: {} },
      ],
    });
    entityService = injector.inject<MockEntityService>(EntityService);
  });

  afterEach(() => destroyInjector());

  describe('when an field option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-entity-link
          .options=${{ entity: 'data', field: 'contact.phone' }}
        ></oryx-entity-link>`
      );
    });

    it('should call the entity service to resolve the data', () => {
      expect(entityService.getField).toHaveBeenCalledWith({
        element: element,
        type: 'data',
        field: 'contact.phone',
      });
    });
  });

  describe('when link is resolved for the field', () => {
    beforeEach(async () => {
      entityService.getField.mockReturnValue(of('https://spryker.com'));
      element = await fixture(
        html`<oryx-entity-link
          .options=${{ entity: 'data', field: 'contact.phone' }}
        ></oryx-entity-link>`
      );
    });

    it('should contain the link element', () => {
      expect(element).toContainElement('oryx-link a');
    });
  });

  describe('when link is not resolved for the field', () => {
    beforeEach(async () => {
      entityService.getField.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-entity-link
          .options=${{ entity: 'data', field: 'contact.phone' }}
        ></oryx-entity-link>`
      );
    });

    it('should not contain the link element', () => {
      expect(element).not.toContainElement('oryx-link');
    });
  });

  describe('when a website url is resolved for the field', () => {
    const mockWebsite = 'https://spryker.com';
    beforeEach(async () => {
      entityService.getField.mockReturnValue(of(mockWebsite));
      element = await fixture(
        html`<oryx-entity-link
          .options=${{ entity: 'data', field: 'contact.phone' }}
        ></oryx-entity-link>`
      );
    });

    it('should not render a specific protocol', () => {
      expect(element).toContainElement(`a[href="${mockWebsite}"]`);
    });
  });

  [
    '+1 (555) 123-4567',
    '+44 20 1234 5678',
    '+49 123 456 789',
    '+81 3 1234 5678',
    '+55 11 1234 5678',
  ].map((mockPhone) => {
    describe.only('when a phone number is resolved for the field', () => {
      beforeEach(async () => {
        entityService.getField.mockReturnValue(of(mockPhone));
        element = await fixture(
          html`<oryx-entity-link
            .options=${{ entity: 'data', field: 'contact.phone' }}
          ></oryx-entity-link>`
        );
      });

      it('should render the a tel: protocol', () => {
        expect(element).toContainElement(`a[href="tel:${mockPhone}"]`);
      });
    });
  });

  describe('when an email address is resolved for the field', () => {
    const mockEmail = 'info@spryker.com';
    beforeEach(async () => {
      entityService.getField.mockReturnValue(of(mockEmail));
      element = await fixture(
        html`<oryx-entity-link
          .options=${{ entity: 'data', field: 'contact.phone' }}
        ></oryx-entity-link>`
      );
    });

    it('should render the a mailto: protocol', () => {
      expect(element).toContainElement(`a[href="mailto:${mockEmail}"]`);
    });
  });
});
