import { cancel } from '@clack/prompts';
import { App, InjectionPlugin } from '@spryker-oryx/core';
import { PromiseSubject } from '@spryker-oryx/utilities';
import { CliPlugin } from './plugin';
import { CliArgsService, CliService } from './services';

vi.mock('@clack/prompts');

describe('CliPlugin', () => {
  class MockApp {
    requirePlugin = vi.fn();
    asReal(): App {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any;
    }
  }

  class MockInjectorPlugin {
    injector = new MockInjector();
    getInjector = vi.fn().mockReturnValue(this.injector);
  }

  class MockInjector {
    inject = vi.fn();
  }

  class MockCliService {
    run = vi.fn();
  }

  class MockCliArgsService {
    getRawArgs = vi.fn();
  }

  function setup({ env = {} } = {}) {
    const mockApp = new MockApp();
    const mockInjectorPlugin = new MockInjectorPlugin();
    const mockInjector = mockInjectorPlugin.injector;
    const mockCliService = new MockCliService();
    const cliPlugin = new CliPlugin();

    mockApp.requirePlugin.mockReturnValue(mockInjectorPlugin);
    mockInjector.inject.mockReturnValue(mockCliService);

    // Prevent process.exit() from terminating the tests
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => void 0 as never);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => void 0);

    process.env = env;

    return {
      cliPlugin,
      mockApp,
      mockInjectorPlugin,
      mockInjector,
      mockCliService,
      exitSpy,
      consoleErrorSpy,
    };
  }

  it('should create an instance', () => {
    const { cliPlugin } = setup();

    expect(cliPlugin).toBeTruthy();
  });

  describe('getName()', () => {
    it('should return the name', () => {
      const { cliPlugin } = setup();

      expect(cliPlugin.getName()).toEqual('oryx$cli');
    });
  });

  describe('apply()', () => {
    it('should do nothing', async () => {
      const { cliPlugin } = setup();

      await expect(cliPlugin.apply()).resolves.toBeUndefined();
    });
  });

  describe('afterApply()', () => {
    it('should call CliService.run()', async () => {
      const { cliPlugin, mockApp, mockCliService, mockInjector } = setup();

      cliPlugin.afterApply(mockApp.asReal());

      expect(mockApp.requirePlugin).toHaveBeenCalledWith(InjectionPlugin);
      expect(mockInjector.inject).toHaveBeenCalledWith(CliService);
      expect(mockCliService.run).toHaveBeenCalled();
    });

    it('should resolve after CliService.run()', async () => {
      const { cliPlugin, mockApp, mockCliService } = setup();

      const promise = new PromiseSubject<void>();
      mockCliService.run.mockReturnValue(promise);

      const res = cliPlugin.afterApply(mockApp.asReal());

      await new Promise((resolve) => setTimeout(resolve));

      await expect(Promise.race([res, 'not-resolved'])).resolves.toBe(
        'not-resolved'
      );

      promise.resolve();

      await expect(res).resolves.toBeUndefined();
    });

    it('should print cancel error if CliService.run() rejects', async () => {
      const { cliPlugin, mockApp, mockCliService } = setup();

      const error = new Error('mock-error');
      mockCliService.run.mockRejectedValue(error);

      await cliPlugin.afterApply(mockApp.asReal());

      expect(cancel).toHaveBeenCalledWith(String(error));
    });

    it('should exit if CliService.run() rejects', async () => {
      const { cliPlugin, mockApp, mockCliService, exitSpy } = setup();

      const error = new Error('mock-error');
      mockCliService.run.mockRejectedValue(error);

      await cliPlugin.afterApply(mockApp.asReal());

      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    describe('if NODE_ENV is development when CliService.run() rejects', () => {
      function caseSetup() {
        const ctx = setup({ env: { NODE_ENV: 'development' } });
        const mockClicArgsService = new MockCliArgsService();

        ctx.mockInjector.inject.mockImplementation((token) => {
          if (token === CliService) {
            return ctx.mockCliService;
          }

          if (token === CliArgsService) {
            return mockClicArgsService;
          }

          return null;
        });

        return { ...ctx, mockClicArgsService };
      }

      it('should print error', async () => {
        const { cliPlugin, mockApp, mockCliService, consoleErrorSpy } =
          caseSetup();

        const error = new Error('mock-error');
        mockCliService.run.mockRejectedValue(error);

        await cliPlugin.afterApply(mockApp.asReal());

        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      });

      it('should print args from CliArgsService.getRawArgs()', async () => {
        const {
          cliPlugin,
          mockApp,
          mockCliService,
          consoleErrorSpy,
          mockClicArgsService,
        } = caseSetup();

        const error = new Error('mock-error');
        mockCliService.run.mockRejectedValue(error);
        mockClicArgsService.getRawArgs.mockReturnValue(['arg1', 'arg2']);

        await cliPlugin.afterApply(mockApp.asReal());

        expect(consoleErrorSpy).toHaveBeenCalledWith('Args:', ['arg1', 'arg2']);
      });
    });
  });
});
