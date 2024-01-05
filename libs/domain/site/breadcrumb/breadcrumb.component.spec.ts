import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { BreadcrumbService } from '@spryker-oryx/site';
import { IconComponent, IconTypes } from '@spryker-oryx/ui/icon';
import { I18nRawContent, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { SiteBreadcrumbComponent } from './breadcrumb.component';
import { siteBreadcrumbComponent } from './breadcrumb.def';

const breadcrumb = {
  url: '/test',
  text: { raw: 'test' },
};

const breadcrumbI18n = {
  url: '/test',
  text: { token: 'test.test', values: { value: 'test' } },
};

const breadcrumbNoUrl = {
  text: { raw: 'test' },
};

const breadcrumbs = [breadcrumb, breadcrumbI18n, breadcrumb];

class MockBreadcrumbService implements BreadcrumbService {
  get = vi.fn().mockReturnValue(of([]));
}

describe('SiteBreadcrumbComponent', () => {
  let element: SiteBreadcrumbComponent;
  let service: MockBreadcrumbService;

  beforeAll(async () => {
    await useComponent(siteBreadcrumbComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: BreadcrumbService,
          useClass: MockBreadcrumbService,
        },
      ],
    });

    service = injector.inject<MockBreadcrumbService>(BreadcrumbService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when breadcrumb are not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-breadcrumb></oryx-site-breadcrumb>`
      );
    });

    it('should not render content', () => {
      expect(element).not.toContainElement('a, span');
    });
  });

  describe('when breadcrumb are provided', () => {
    beforeEach(async () => {
      service.get = vi.fn().mockReturnValue(of(breadcrumbs));
      element = await fixture(
        html`<oryx-site-breadcrumb></oryx-site-breadcrumb>`
      );
    });

    it('should render each breadcrumb', () => {
      const items = element.renderRoot.querySelectorAll('a, span');
      expect(items.length).toBe(breadcrumbs.length);
    });

    it('should render breadcrumbs.length - 1 dividers', () => {
      const dividers = element.renderRoot.querySelectorAll('oryx-icon');
      expect(dividers.length).toBe(breadcrumbs.length - 1);
    });

    it('should render span as last breadcrumb', () => {
      const last = element.renderRoot.querySelector('span');
      expect(last?.textContent).toBe(
        (breadcrumbs[2].text as I18nRawContent).raw
      );
    });

    describe('and breadcrumb has a text label', () => {
      beforeEach(async () => {
        service.get = vi.fn().mockReturnValue(of([breadcrumb, breadcrumb]));
        element = await fixture(
          html`<oryx-site-breadcrumb></oryx-site-breadcrumb>`
        );
      });

      it('should render the text as a label for the link', () => {
        const link = element.renderRoot.querySelector('a');
        expect(link?.textContent).toContain(breadcrumb.text?.raw);
      });

      it('should pass url to the href', () => {
        expect(element).toContainElement(`a[href="${breadcrumb.url}"]`);
      });
    });

    describe('and breadcrumb has a text i18n token', () => {
      let spy: SpyInstance;
      beforeEach(async () => {
        service.get = vi.fn().mockReturnValue(of([breadcrumbI18n, breadcrumb]));
        element = await fixture(
          html`<oryx-site-breadcrumb></oryx-site-breadcrumb>`
        );
        spy = vi.spyOn(element, 'i18n');
        element.requestUpdate();
        await elementUpdated(element);
      });

      it('should translate the token', () => {
        expect(spy).toHaveBeenCalledWith(
          breadcrumbI18n.text.token,
          breadcrumbI18n.text.values
        );
      });

      it('should render a link', () => {
        expect(element).toContainElement(`a[href="${breadcrumb.url}"]`);
      });
    });

    describe('and breadcrumb does not have an url', () => {
      beforeEach(async () => {
        service.get = vi
          .fn()
          .mockReturnValue(of([breadcrumbNoUrl, breadcrumb]));
        element = await fixture(
          html`<oryx-site-breadcrumb></oryx-site-breadcrumb>`
        );
      });

      it('should not render href attribute of the link', () => {
        expect(element).toContainElement('a:not([href])');
      });
    });

    describe('and divider option is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-site-breadcrumb
          .options=${{ divider: IconTypes.Add }}
        ></oryx-site-breadcrumb>`);
      });

      it('should icon type to the icon', () => {
        const divider =
          element.renderRoot.querySelector<IconComponent>('oryx-icon');
        expect(divider?.type).toBe(IconTypes.Add);
      });
    });

    describe('and divider is equal empty string', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-site-breadcrumb
          .options=${{ divider: '' }}
        ></oryx-site-breadcrumb>`);
      });

      it('should not render the dividers', () => {
        expect(element).not.toContainElement('oryx-icon');
      });
    });
  });
});
