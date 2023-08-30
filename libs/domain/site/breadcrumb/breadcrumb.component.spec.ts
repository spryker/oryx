import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { BreadcrumbItem, BreadcrumbService } from '@spryker-oryx/site';
import { ButtonComponent } from '@spryker-oryx/ui/button';
import { IconComponent, IconTypes } from '@spryker-oryx/ui/icon';
import { I18nContext, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { SiteBreadcrumbComponent } from './breadcrumb.component';
import { siteBreadcrumbComponent } from './breadcrumb.def';

const breadcrumb: BreadcrumbItem = {
  url: '/test',
  text: { raw: 'test' },
};

const breadcrumbI18n: BreadcrumbItem = {
  url: '/test',
  text: { token: 'test.test', values: { value: 'test' } },
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
      expect(element).not.toContainElement('oryx-button');
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
      const items = element.renderRoot.querySelectorAll('oryx-button');
      expect(items.length).toBe(breadcrumbs.length);
    });

    it('should render breadcrumbs.length - 1 dividers', () => {
      const dividers = element.renderRoot.querySelectorAll('oryx-icon');
      expect(dividers.length).toBe(breadcrumbs.length - 1);
    });

    it('should disable the last breadcrumb', () => {
      expect(element).toContainElement('oryx-button[disabled]:last-of-type');
    });

    describe('and breadcrumb has a text label', () => {
      beforeEach(async () => {
        service.get = vi.fn().mockReturnValue(of([breadcrumb]));
        element = await fixture(
          html`<oryx-site-breadcrumb></oryx-site-breadcrumb>`
        );
      });

      it('should render the text as a label for item', () => {
        const link = element.renderRoot.querySelector('oryx-button');
        expect(link?.textContent).toContain(breadcrumb.text?.raw);
      });

      it('should pass url to the href', () => {
        const item =
          element.renderRoot.querySelector<ButtonComponent>('oryx-button');
        expect(item?.href).toBe(breadcrumb.url);
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
        const text = breadcrumbI18n.text as {
          token: string;
          values?: I18nContext;
        };
        expect(spy).toHaveBeenCalledWith(text.token, text.values);
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
