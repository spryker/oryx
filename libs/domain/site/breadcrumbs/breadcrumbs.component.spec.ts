import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Breadcrumb, BreadcrumbsService } from '@spryker-oryx/site';
import { IconComponent, IconTypes } from '@spryker-oryx/ui/icon';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { SiteBreadcrumbsComponent } from './breadcrumbs.component';
import { siteBreadcrumbsComponent } from './breadcrumbs.def';

const breadcrumb: Breadcrumb = {
  url: '/test',
  text: 'test',
};

const breadcrumbI18n: Breadcrumb = {
  url: '/test',
  i18n: { token: 'test.test', values: { value: 'test' } },
};

const breadcrumbNoUrl: Breadcrumb = {
  text: 'test',
};

const breadcrumbs = [breadcrumb, breadcrumbI18n, breadcrumbNoUrl];

class MockBreadcrumbsService implements BreadcrumbsService {
  get = vi.fn().mockReturnValue(of([]));
}

describe('SiteBreadcrumbsComponent', () => {
  let element: SiteBreadcrumbsComponent;
  let service: MockBreadcrumbsService;

  beforeAll(async () => {
    await useComponent(siteBreadcrumbsComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: BreadcrumbsService,
          useClass: MockBreadcrumbsService,
        },
      ],
    });

    service = injector.inject<MockBreadcrumbsService>(BreadcrumbsService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when breadcrumbs are not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-breadcrumbs></oryx-site-breadcrumbs>`
      );
    });

    it('should not render content', () => {
      expect(element).not.toContainElement('a');
    });
  });

  describe('when breadcrumbs are provided', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(breadcrumbs));
      element = await fixture(
        html`<oryx-site-breadcrumbs></oryx-site-breadcrumbs>`
      );
    });

    it('should render a link for each breadcrumb', () => {
      const links = element.renderRoot.querySelectorAll('a');
      expect(links.length).toBe(breadcrumbs.length);
    });

    it('should render breadcrumbs.length - 1 dividers', () => {
      const dividers = element.renderRoot.querySelectorAll('oryx-icon');
      expect(dividers.length).toBe(breadcrumbs.length - 1);
    });

    describe('and breadcrumb has a text label', () => {
      beforeEach(async () => {
        service.get = vi.fn().mockReturnValue(of([breadcrumb]));
        element = await fixture(
          html`<oryx-site-breadcrumbs></oryx-site-breadcrumbs>`
        );
      });

      it('should render the text as a label for the link', () => {
        const link = element.renderRoot.querySelector('a');
        expect(link?.textContent).toContain(breadcrumb.text);
      });

      it('should pass url to the href', () => {
        expect(element).toContainElement(`a[href="${breadcrumb.url}"]`);
      });
    });

    describe('and breadcrumb has a text i18n token', () => {
      let spy: SpyInstance;
      beforeEach(async () => {
        service.get = vi.fn().mockReturnValue(of([breadcrumbI18n]));
        element = await fixture(
          html`<oryx-site-breadcrumbs></oryx-site-breadcrumbs>`
        );
        spy = vi.spyOn(element, 'i18n');
        element.requestUpdate();
        await elementUpdated(element);
      });

      it('should translate the token', () => {
        expect(spy).toHaveBeenCalledWith(
          breadcrumbI18n.i18n?.token,
          breadcrumbI18n.i18n?.values
        );
      });
    });

    describe('and breadcrumb does not have an url', () => {
      beforeEach(async () => {
        service.get = vi.fn().mockReturnValue(of([breadcrumbNoUrl]));
        element = await fixture(
          html`<oryx-site-breadcrumbs></oryx-site-breadcrumbs>`
        );
      });

      it('should not render href attribute of the link', () => {
        expect(element).toContainElement('a:not([href])');
      });
    });

    describe('and dividerIcon option is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-site-breadcrumbs
          .options=${{ dividerIcon: IconTypes.Add }}
        ></oryx-site-breadcrumbs>`);
      });

      it('should icon type to the icon', () => {
        const divider =
          element.renderRoot.querySelector<IconComponent>('oryx-icon');
        expect(divider?.type).toBe(IconTypes.Add);
      });
    });

    describe('and showDivider option is false', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-site-breadcrumbs
          .options=${{ showDivider: false }}
        ></oryx-site-breadcrumbs>`);
      });

      it('should not render the dividers', () => {
        expect(element).not.toContainElement('oryx-icon');
      });
    });
  });
});
