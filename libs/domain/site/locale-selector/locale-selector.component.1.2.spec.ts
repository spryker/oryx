import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Locale, LocaleService } from '@spryker-oryx/i18n';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SiteLocaleSelectorComponent } from './locale-selector.component';
import { siteLocaleSelectorComponent } from './locale-selector.def';

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn().mockReturnValue(of('en'));
  getAll = vi.fn().mockReturnValue([]);
  set = vi.fn();
}

describe('SiteLocaleSelectorComponent (v1.2)', () => {
  let element: SiteLocaleSelectorComponent;
  let service: MockLocaleService;

  beforeAll(async () => {
    await useComponent([siteLocaleSelectorComponent]);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
      ],
    });
    service = injector.inject(LocaleService) as unknown as MockLocaleService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when there are more then one locale', () => {
    beforeEach(async () => {
      service.getAll.mockReturnValue(
        of([
          { code: 'en', name: 'en_US' },
          { code: 'de', name: 'de_DE' },
          { code: 'es', name: 'es_ES' },
        ] as Locale[])
      );
      element = await fixture(
        html`<oryx-site-locale-selector></oryx-site-locale-selector>`
      );
      mockFeatureVersion('1.6');
    });

    it('should render the US flag selector', () => {
      const button = element.shadowRoot?.querySelector('oryx-button');
      expect(button?.textContent).toContain('en');
    });

    describe('and enableFlag options is true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-locale-selector
            .options=${{ enableFlag: true }}
          ></oryx-site-locale-selector>`
        );
      });

      it('should render US flag in the button', () => {
        const button = element.shadowRoot?.querySelector('oryx-button');
        expect(button?.textContent).toContain('🇺🇸');
      });
    });

    describe('and enableFlag options is false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-locale-selector
            .options=${{ enableFlag: false }}
          ></oryx-site-locale-selector>`
        );
      });

      it('should not render US flag in the button', () => {
        const button = element.shadowRoot?.querySelector('oryx-button');
        expect(button?.textContent).not.toContain('🇺🇸');
      });
    });
  });
});
