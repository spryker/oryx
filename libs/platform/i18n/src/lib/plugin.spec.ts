import { App, InjectionPlugin } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { I18nInjectable, Injectable } from '@spryker-oryx/utilities';
import { I18nService } from './i18n.service';
import { I18nPlugin } from './plugin';

describe('I18nPlugin', () => {
  class MockApp implements App {
    findPlugin = vi.fn();
    requirePlugin = vi.fn();
    registerPlugin = vi.fn();
    whenReady = vi.fn();
    markReady = vi.fn();
    destroy = vi.fn();
  }

  class MockInjectionPlugin implements Pick<InjectionPlugin, 'getInjector'> {
    constructor(public injector: Injector) {}
    getInjector = vi.fn().mockReturnValue(this.injector);
  }

  class MockInjector implements Pick<Injector, 'inject'> {
    inject = vi.fn();
    asReal(): Injector {
      return this as any;
    }
  }

  class MockI18nInjectable
    implements Pick<Injectable<I18nInjectable>, 'inject'>
  {
    inject = vi.fn();
    asReal(): Injectable<I18nInjectable> {
      return this as any;
    }
  }

  function setup() {
    const i18nInjectable = new MockI18nInjectable();
    const mockI18nAdapterFactory = vi.fn();
    const plugin = new I18nPlugin(
      mockI18nAdapterFactory,
      i18nInjectable.asReal()
    );
    const app = new MockApp();
    const injector = new MockInjector();
    const injectorPlugin = new MockInjectionPlugin(injector.asReal());
    const mockI18nService = { mockI18nService: true };
    const mockI18nAdapter = { mockI18nAdapter: true };

    app.requirePlugin.mockImplementation((t) =>
      t === InjectionPlugin ? injectorPlugin : undefined
    );
    injector.inject.mockImplementation((t) =>
      t === I18nService ? mockI18nService : undefined
    );
    mockI18nAdapterFactory.mockReturnValue(mockI18nAdapter);

    return {
      plugin,
      i18nInjectable,
      app,
      injector,
      mockI18nAdapterFactory,
      mockI18nAdapter,
      mockI18nService,
    };
  }

  it('should inject I18nService to I18nInjectable using adapter', () => {
    const {
      plugin,
      app,
      i18nInjectable,
      injector,
      mockI18nAdapterFactory,
      mockI18nAdapter,
      mockI18nService,
    } = setup();

    plugin.apply(app);

    expect(injector.inject).toHaveBeenCalledWith(I18nService);
    expect(mockI18nAdapterFactory).toHaveBeenCalledWith(mockI18nService);
    expect(i18nInjectable.inject).toHaveBeenCalledWith(mockI18nAdapter);
  });

  describe('getName() method', () => {
    it('should return i18n plugin name', () => {
      const plugin = new I18nPlugin();

      expect(plugin.getName()).toBe('fes$i18n');
    });
  });
});
