import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { SemanticLinkService } from '@spryker-oryx/site';
import { IconComponent } from '@spryker-oryx/ui/icon';
import { LinkComponent } from '@spryker-oryx/ui/link';
import { html } from 'lit';
import { of } from 'rxjs';
import { ContentLinkComponent } from './link.component';
import { contentLinkComponent } from './link.def';
import { ContentLinkContent, ContentLinkOptions } from './link.model';
import { RouteLinkType } from '@spryker-oryx/router/lit';

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of('/page'));
}

describe('ContentLinkComponent', () => {
  let element: ContentLinkComponent;
  let semanticLinkService: MockSemanticLinkService;

  beforeAll(async () => {
    await useComponent(contentLinkComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });

    semanticLinkService =
      injector.inject<MockSemanticLinkService>(SemanticLinkService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .content=${{ text: 'test' } as ContentLinkContent}
        ></oryx-content-link>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(ContentLinkComponent);
    });

    it('should pass the text to the link', () => {
      expect(element.renderRoot.textContent?.trim()).toBe('test');
    });
  });

  describe('when a url is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ url: '/test' } as ContentLinkOptions}
        ></oryx-content-link>`
      );
    });

    it('should render the url', () => {
      expect(element).toContainElement('a[href="/test"]');
    });
  });

  describe('when url nor type is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{} as ContentLinkOptions}
        ></oryx-content-link>`
      );
    });

    it('should not render a link', () => {
      expect(element).not.toContainElement('a');
    });
  });

  describe('when type is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{
            type: RouteLinkType.Product,
            id: '123',
            params: { foo: 'bar' },
          }}
        ></oryx-content-link>`
      );
    });

    it('should resolve the link from the SemanticLinkService', () => {
      expect(semanticLinkService.get).toHaveBeenCalledWith({
        type: RouteLinkType.Product,
        id: '123',
        params: { foo: 'bar' },
      });
    });

    it('should build the correct link', () => {
      expect(element).toContainElement('a[href="/page"]');
    });
  });

  describe('when url and type are not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-content-link></oryx-content-link>`);
    });

    it('should build the correct link', () => {
      expect(element).not.toContainElement('a');
    });
  });

  describe('when noopener is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{
            type: RouteLinkType.Page,
            noopener: true,
          }}
        ></oryx-content-link>`
      );
    });

    it('should combine correct attribute', () => {
      expect(element).toContainElement('a[rel=noopener]');
    });
  });

  describe('when nofollow is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{
            type: RouteLinkType.Page,
            nofollow: true,
          }}
        ></oryx-content-link>`
      );
    });

    it('should combine correct attribute', () => {
      expect(element).toContainElement('a[rel=nofollow]');
    });
  });

  describe('when noopener and nofollow are provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{
            type: RouteLinkType.Page,
            noopener: true,
            nofollow: true,
          }}
        ></oryx-content-link>`
      );
    });

    it('should combine correct attribute', () => {
      expect(element).toContainElement('a[rel="noopener nofollow"]');
    });
  });

  describe('when label is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ url: '/test', label: 'test label' }}
        ></oryx-content-link>`
      );
    });

    it('should pass set aria-label on the link', () => {
      expect(element).toContainElement('a[aria-label="test label"]');
    });
  });

  describe('when target is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ url: '/test', target: '_blank' }}
        ></oryx-content-link>`
      );
    });

    it('should pass set target on the link', () => {
      expect(element).toContainElement('a[target]');
    });
  });

  describe('when icon is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ icon: 'test' }}
        ></oryx-content-link>`
      );
    });

    it('should pass the icon to oryx-link', () => {
      const iconEl =
        element.shadowRoot?.querySelector<LinkComponent>('oryx-link');
      expect(iconEl?.icon).toBe('test');
    });
  });

  describe('when button option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ url: '/test', button: true }}
        ></oryx-content-link>`
      );
    });

    it('should render link inside oryx-button', () => {
      expect(element).toContainElement('oryx-button a');
    });

    it('should not render oryx-link', () => {
      expect(element).not.toContainElement('oryx-link');
    });

    describe('and an icon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-link
            .options=${{ url: '/test', button: true, icon: 'check' }}
          ></oryx-content-link>`
        );
      });

      it('should provide the icon to the oryx-button', () => {
        const icon = element.renderRoot.querySelector(
          'oryx-icon'
        ) as IconComponent;
        expect(icon.type).toBe('check');
      });
    });
  });
});
