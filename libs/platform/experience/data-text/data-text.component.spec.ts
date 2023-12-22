import { fixture } from '@open-wc/testing-helpers';
import { ContextService, EntityService } from '@spryker-oryx/core';
import { Injector, createInjector, destroyInjector } from '@spryker-oryx/di';
import { LinkService } from '@spryker-oryx/router';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { DataTextComponent } from './data-text.component';
import { dataText } from './data-text.def';

class MockEntityService implements Partial<EntityService> {
  getField = vi.fn().mockReturnValue(of());
  getQualifier = vi.fn().mockReturnValue(of());
}

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of());
}

describe('DataTextComponent', () => {
  let element: DataTextComponent;
  let entityService: MockEntityService;
  let injector: Injector;

  beforeAll(async () => {
    await useComponent(dataText);
  });

  beforeEach(async () => {
    injector = createInjector({
      providers: [
        { provide: EntityService, useClass: MockEntityService },
        { provide: ContextService, useValue: {} },
        { provide: LinkService, useClass: MockLinkService },
      ],
    });
    entityService = injector.inject<MockEntityService>(EntityService);
  });

  afterEach(() => destroyInjector());

  describe('when an field option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-data-text
          .options=${{ entity: 'data', field: 'name' }}
        ></oryx-data-text>`
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
        html`<oryx-data-text
          .options=${{ entity: 'data', field: 'name' }}
        ></oryx-data-text>`
      );
    });

    it('should render the text', () => {
      expect(element.shadowRoot?.textContent).toContain('foo bar');
    });

    describe('and a prefix option is configured', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-data-text
            .options=${{ entity: 'data', field: 'name', prefix: 'prefix-' }}
          ></oryx-data-text>`
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
        html`<oryx-data-text
          .options=${{ entity: 'data', field: 'name', tag: HeadingTag.H3 }}
        ></oryx-data-text>`
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
          html`<oryx-data-text
            .options=${{
              entity: 'data',
              field: 'name',
              tag: HeadingTag.H3,
              prefix: 'prefix-',
            }}
          ></oryx-data-text>`
        );
      });

      it('should render the prefix inside the heading', () => {
        const heading = element.shadowRoot?.querySelector('oryx-heading');
        expect(heading?.textContent?.trim()).toEqual('prefix-foo bar');
      });
    });
  });

  describe('when a link option is configured', () => {
    beforeEach(async () => {
      entityService.getField.mockReturnValue(of('foo bar'));
      entityService.getQualifier.mockReturnValue(of('some-qualifier'));

      const linkService = injector.inject<MockLinkService>(LinkService);
      linkService.get.mockReturnValue(of('some-url'));

      element = await fixture(
        html`<oryx-data-text
          .options=${{ entity: 'data', field: 'name', link: true }}
        ></oryx-data-text>`
      );
    });

    it('should render the link component', () => {
      expect(element).toContainElement('oryx-link');
      const linkElement = element.shadowRoot?.querySelector('oryx-link');
      expect(linkElement?.innerHTML).toContain('<a href="some-url">');
      expect(linkElement?.textContent).toContain('foo bar');
    });
  });
});
