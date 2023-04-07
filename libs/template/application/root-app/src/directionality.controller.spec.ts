import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { subscribe } from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { DirectionalityController } from './directionality.controller';

@customElement('test-component')
class TestComponent extends LitElement {
  @subscribe()
  protected dirSetup = new DirectionalityController(this).install();
}

const injectMockLocaleService = (lang?: string) => {
  class MockLocaleService implements Partial<LocaleService> {
    get = vi.fn().mockReturnValue(lang ? of(lang) : null);
  }

  createInjector({
    providers: [
      {
        provide: LocaleService,
        useClass: MockLocaleService,
      },
    ],
  });
};

describe('DirectionalityController', () => {
  let element: TestComponent;

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when locale has language with LTR direction', () => {
    beforeEach(async () => {
      injectMockLocaleService('de');
      element = await fixture(html`<test-component></test-component>`);
    });

    it('should set dir attribute with ltr value', () => {
      expect(element.getAttribute('dir')).toBe('ltr');
    });
  });

  describe('when locale has language with RTL direction', () => {
    beforeEach(async () => {
      injectMockLocaleService('ar');
      element = await fixture(html`<test-component></test-component>`);
    });

    it('should set dir attribute with rtl value', () => {
      expect(element.getAttribute('dir')).toBe('rtl');
    });
  });

  describe('when locale language is not provided', () => {
    beforeEach(async () => {
      injectMockLocaleService();
      element = await fixture(html`<test-component></test-component>`);
    });

    it('should not set dir attribute', () => {
      expect(element.getAttribute('dir')).toBe(null);
    });
  });
});
