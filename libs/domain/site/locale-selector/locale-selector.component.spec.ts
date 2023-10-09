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

describe('SiteLocaleSelectorComponent', () => {
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

  describe('when the component is initialised', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-locale-selector></oryx-site-locale-selector>`
      );
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(SiteLocaleSelectorComponent);
    });
  });

  describe('when there are no locales', () => {
    beforeEach(async () => {
      service.getAll.mockReturnValue(of([]));
      element = await fixture(
        html`<oryx-site-locale-selector></oryx-site-locale-selector>`
      );
    });

    it('should not render the locale selector', () => {
      expect(element).not.toContainElement('oryx-button');
    });
  });

  describe('when there is only one locale', () => {
    beforeEach(async () => {
      service.getAll.mockReturnValue(of([{ code: 'en' } as Locale]));
      element = await fixture(
        html`<oryx-site-locale-selector></oryx-site-locale-selector>`
      );
    });

    it('should not show the locale selector', () => {
      expect(element).not.toContainElement('oryx-button');
    });
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
    });

    it('should render the locale selector', () => {
      expect(element).toContainElement('oryx-button');
    });

    it('should not render the US flag selector', () => {
      const button = element.shadowRoot?.querySelector('oryx-button');
      expect(button?.textContent).toContain('en');
      expect(button?.textContent).not.toContain('🇺🇸');
    });

    it('should render the english option in its native locale', () => {
      const en = element.shadowRoot?.querySelector('oryx-option[value=en]');
      expect(en?.textContent).toContain('English');
    });

    it('should render the Deutsch option in its native locale', () => {
      const en = element.shadowRoot?.querySelector('oryx-option[value=de]');
      expect(en?.textContent).toContain('Deutsch');
    });

    it('should render the Spanish option in its native locale', () => {
      const en = element.shadowRoot?.querySelector('oryx-option[value=es]');
      expect(en?.textContent).toContain('español');
    });

    describe('and when a locale is selected', () => {
      beforeEach(async () => {
        const de = element.shadowRoot?.querySelector('oryx-option[value=de]');
        de?.dispatchEvent(new Event('click'));
      });

      it('should change set the locale', () => {
        expect(service.set).toHaveBeenCalledWith('de');
      });
    });

    describe('when the version >= 1.2', () => {
      beforeEach(() => {
        mockFeatureVersion('1.2');
      });

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
      });

      it('should render the US flag selector', () => {
        const button = element.shadowRoot?.querySelector('oryx-button');
        expect(button?.textContent).toContain('en');
        expect(button?.textContent).toContain('🇺🇸');
      });
    });
  });
});
