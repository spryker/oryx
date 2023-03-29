import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Locale, LocaleService } from '@spryker-oryx/i18n';
import { siteLocaleSelectorComponent } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { SiteLocaleSelectorComponent } from './locale-selector.component';

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
      expect(element).not.toContainElement('button');
    });
  });

  describe('when there is only one locales', () => {
    beforeEach(async () => {
      service.getAll.mockReturnValue(of([{ code: 'en' } as Locale]));
      element = await fixture(
        html`<oryx-site-locale-selector></oryx-site-locale-selector>`
      );
    });

    it('should not show the locale selector', () => {
      expect(element).not.toContainElement('button');
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
      expect(element).not.toContainElement('button');
    });
  });

  describe('when there are more then one locale', () => {
    beforeEach(async () => {
      service.getAll.mockReturnValue(
        of([{ code: 'en' }, { code: 'de' }, { code: 'es' }] as Locale[])
      );
      element = await fixture(
        html`<oryx-site-locale-selector></oryx-site-locale-selector>`
      );
    });

    it('should render the locale selector', () => {
      expect(element).toContainElement('button');
    });

    it('should render the options', () => {
      expect(element).toContainElement('oryx-option[value=en');
      expect(element).toContainElement('oryx-option[value=de');
      expect(element).toContainElement('oryx-option[value=es');
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
  });
});
