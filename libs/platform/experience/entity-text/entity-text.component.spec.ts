import { fixture } from '@open-wc/testing-helpers';
import { ContextService, EntityService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LinkService } from '@spryker-oryx/router';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { EntityTextComponent } from './entity-text.component';
import { entityText } from './entity-text.def';

class MockEntityService implements Partial<EntityService> {
  getField = vi.fn().mockReturnValue(of());
}

describe('EntityTextComponent', () => {
  let element: EntityTextComponent;
  let entityService: MockEntityService;

  beforeAll(async () => {
    await useComponent(entityText);
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
        html`<oryx-entity-text
          .options=${{ entity: 'data', field: 'name' }}
        ></oryx-entity-text>`
      );
    });

    it('should call the entity service to resolve the data', () => {
      expect(entityService.getField).toHaveBeenCalledWith({
        element: element,
        type: 'data',
        field: 'name',
      });
    });
  });

  describe('when text is resolved for the field', () => {
    beforeEach(async () => {
      entityService.getField.mockReturnValue(of('foo bar'));
      element = await fixture(
        html`<oryx-entity-text
          .options=${{ entity: 'data', field: 'name' }}
        ></oryx-entity-text>`
      );
    });

    it('should render the text', () => {
      expect(element.shadowRoot?.textContent).toContain('foo bar');
    });

    describe('and a prefix option is configured', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-entity-text
            .options=${{ entity: 'data', field: 'name', prefix: 'prefix-' }}
          ></oryx-entity-text>`
        );
      });

      it('should render the prefix', () => {
        expect(element.shadowRoot?.textContent?.trim()).toEqual(
          'prefix-foo bar'
        );
      });
    });
  });

  describe('when a tag option is configured', () => {
    beforeEach(async () => {
      entityService.getField.mockReturnValue(of('foo bar'));
      element = await fixture(
        html`<oryx-entity-text
          .options=${{ entity: 'data', field: 'name', tag: HeadingTag.H3 }}
        ></oryx-entity-text>`
      );
    });

    it('should render the heading component', () => {
      expect(element).toContainElement('oryx-heading');
    });

    it('should render text in the heading component', () => {
      expect(element.shadowRoot?.textContent?.trim()).toEqual('foo bar');
    });

    describe('and a prefix option is configured', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-entity-text
            .options=${{
              entity: 'data',
              field: 'name',
              tag: HeadingTag.H3,
              prefix: 'prefix-',
            }}
          ></oryx-entity-text>`
        );
      });

      it('should render the prefix inside the heading', () => {
        const heading = element.shadowRoot?.querySelector('oryx-heading');
        expect(heading?.textContent?.trim()).toEqual('prefix-foo bar');
      });
    });
  });

  // describe('when a link option is configured', () => {
  //   beforeEach(async () => {
  //     entityService.getField.mockReturnValue('foo bar');
  //     element = await fixture(
  //       html`<oryx-entity-text
  //         .options=${{ entity: 'data', field: 'name', link: true }}
  //       ></oryx-entity-text>`
  //     );
  //   });

  //   it('should render the heading component', () => {
  //     expect(element).toContainElement('oryx-link');
  //   });
  // });
});
